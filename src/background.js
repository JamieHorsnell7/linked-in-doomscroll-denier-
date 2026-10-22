"use strict";

importScripts("config.js", "messages.js", "timer.js");

var STORAGE_KEY = "scrollhog-state";
var ALARM = "scrollhog-tick";
var LINKEDIN_PATTERNS = ["https://*.linkedin.com/*", "https://linkedin.com/*"];

var queue = Promise.resolve();

function enqueue(task) {
  var run = queue.then(task, task);
  queue = run.then(
    function () {},
    function () {}
  );
  return run;
}

function isLinkedInUrl(url) {
  if (typeof url !== "string" || url.length > 2048) return false;
  try {
    var parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    var host = parsed.hostname;
    return host === "linkedin.com" || host.endsWith(".linkedin.com");
  } catch (err) {
    return false;
  }
}

function linkedInTabs() {
  return chrome.tabs.query({ url: LINKEDIN_PATTERNS });
}

function fromLinkedIn(sender) {
  if (!sender || !sender.tab || sender.id !== chrome.runtime.id) return false;
  return isLinkedInUrl(sender.url || sender.tab.url || "");
}

async function readState() {
  var stored = await chrome.storage.session.get(STORAGE_KEY);
  return Scrollhog.normalizeState(stored[STORAGE_KEY]);
}

async function writeState(state) {
  var record = {};
  record[STORAGE_KEY] = state;
  await chrome.storage.session.set(record);
}

function messageAt(index) {
  var messages = Scrollhog.MESSAGES;
  var safe = messages[index % messages.length];
  return safe;
}

function payloadFor(state) {
  var copy = messageAt(state.messageIndex);
  return {
    ok: true,
    overlayVisible: state.overlayVisible === true,
    kicker: copy.kicker,
    message: copy.text,
    elapsedMs: state.shownElapsedMs || 0,
    snoozeMs: Scrollhog.CONFIG.SNOOZE_THRESHOLD_MS,
    revision: state.revision,
  };
}

async function sendToTab(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    // The tab can be a LinkedIn URL before the content script exists.
  }
}

async function broadcast(message) {
  var tabs = await linkedInTabs();
  await Promise.all(
    tabs.map(function (tab) {
      return sendToTab(tab.id, message);
    })
  );
}

async function syncAlarm() {
  var tabs = await linkedInTabs();
  if (tabs.length === 0) {
    await chrome.alarms.clear(ALARM);
    return 0;
  }
  var existing = await chrome.alarms.get(ALARM);
  if (!existing) {
    chrome.alarms.create(ALARM, { periodInMinutes: 0.5, delayInMinutes: 0.5 });
  }
  return tabs.length;
}

async function onTick(now) {
  var tabCount = await syncAlarm();
  var state = await readState();
  if (tabCount === 0) {
    if (state.lastTick !== null) {
      state = Scrollhog.pause(state);
      await writeState(state);
    }
    return state;
  }
  var result = Scrollhog.applyHeartbeat(state, now, Scrollhog.CONFIG);
  await writeState(result.state);
  if (result.action === "show") {
    var showMessage = payloadFor(result.state);
    showMessage.type = "show";
    await broadcast(showMessage);
  }
  return result.state;
}

async function onIgnore(now) {
  var state = Scrollhog.applyIgnore(await readState(), now);
  await writeState(state);
  await broadcast({ type: "hide", revision: state.revision });
  return state;
}

async function onClose(sender) {
  var tabs = await linkedInTabs();
  var ids = tabs.map(function (tab) {
    return tab.id;
  });
  var senderUrl = sender && (sender.url || (sender.tab && sender.tab.url));
  if (sender && sender.tab && isLinkedInUrl(senderUrl) && ids.indexOf(sender.tab.id) === -1) {
    ids.push(sender.tab.id);
  }
  if (ids.length) {
    try {
      await chrome.tabs.remove(ids);
    } catch (err) {
      // A tab may close itself before the group removal lands.
    }
  }
  var state = Scrollhog.applyReset(await readState());
  await writeState(state);
  return state;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!message || typeof message !== "object" || typeof message.type !== "string") {
    return false;
  }
  if (!fromLinkedIn(sender)) {
    sendResponse({ ok: false });
    return false;
  }

  var now = Date.now();
  enqueue(function () {
    if (message.type === "heartbeat") {
      return onTick(now).then(function (state) {
        sendResponse(payloadFor(state));
      });
    }
    if (message.type === "get-state") {
      return syncAlarm().then(readState).then(function (state) {
        sendResponse(payloadFor(state));
      });
    }
    if (message.type === "ignore") {
      return onIgnore(now).then(function (state) {
        sendResponse(payloadFor(state));
      });
    }
    if (message.type === "close-tabs") {
      return onClose(sender).then(function () {
        sendResponse({ ok: true });
      });
    }
    sendResponse({ ok: false });
    return undefined;
  }).catch(function () {
    try {
      sendResponse({ ok: false });
    } catch (err) {
      // The tab may already be gone.
    }
  });
  return true;
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (!alarm || alarm.name !== ALARM) return;
  enqueue(function () {
    return onTick(Date.now());
  });
});

chrome.tabs.onRemoved.addListener(function () {
  enqueue(function () {
    return onTick(Date.now());
  });
});

chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  var url = (changeInfo && changeInfo.url) || (tab && tab.url);
  if (!isLinkedInUrl(url)) return;
  enqueue(function () {
    return syncAlarm();
  });
});
