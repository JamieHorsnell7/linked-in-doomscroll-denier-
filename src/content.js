"use strict";

var HOST_PROPS = {
  position: "fixed",
  "z-index": "2147483647",
  top: "16px",
  left: "50%",
  width: "min(440px, calc(100vw - 24px))",
  transform: "translateX(-50%)",
  display: "block",
  margin: "0",
  padding: "0",
  border: "none",
  background: "transparent",
  "pointer-events": "none",
};

var localRevision = -1;
var mounted = null;
var host = null;
var shadow = null;
var heartbeatTimer = null;

if (!globalThis.__scrollsaverBooted) {
  globalThis.__scrollsaverBooted = true;
  chrome.runtime.onMessage.addListener(onRuntimeMessage);
  window.addEventListener("keydown", onKeyDown, true);
  send("get-state").then(applyRemote);
  heartbeatTimer = setInterval(heartbeat, ScrollSaver.CONFIG.HEARTBEAT_MS);
  heartbeat();
}

function heartbeat() {
  if (!extensionAlive()) {
    clearInterval(heartbeatTimer);
    return;
  }
  if (mounted && host && !host.isConnected && document.documentElement) {
    document.documentElement.appendChild(host);
    pinHost(host);
  }
  send("heartbeat").then(applyRemote);
}

function onRuntimeMessage(message) {
  if (!message || typeof message !== "object") return;
  if (message.type === "show") applyRemote(message);
  if (message.type === "hide") applyRemote(Object.assign({ overlayVisible: false }, message));
}

function onKeyDown(event) {
  if (!mounted || event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  dismiss();
}

function applyRemote(payload) {
  if (!payload || payload.ok === false) return;
  if (!ScrollSaver.shouldApply(localRevision, payload.revision)) return;
  localRevision = payload.revision;
  if (payload.overlayVisible === true && isCopy(payload)) {
    show(payload);
    return;
  }
  hide();
}

function show(payload) {
  if (mounted && mounted.text === payload.message && host && host.isConnected) return;
  hide();
  var root = ensureShadow();
  mounted = {
    text: payload.message,
    handle: ScrollSaver.mountOverlay(root, {
      kicker: payload.kicker,
      message: payload.message,
      elapsedMs: payload.elapsedMs,
      snoozeMs: payload.snoozeMs || ScrollSaver.CONFIG.SNOOZE_THRESHOLD_MS,
      onIgnore: dismiss,
      onClose: closeTabs,
    }),
  };
}

function hide() {
  if (mounted) {
    mounted.handle.destroy();
    mounted = null;
  }
  if (host) host.remove();
  host = null;
  shadow = null;
}

function dismiss() {
  hide();
  send("ignore").then(applyRemote);
}

function closeTabs() {
  send("close-tabs");
}

function ensureShadow() {
  if (shadow && host && host.isConnected) return shadow;
  host = document.createElement("div");
  host.id = "scrollsaver-host";
  pinHost(host);
  shadow = host.attachShadow({ mode: "closed" });
  var parent = document.documentElement || document.body;
  parent.appendChild(host);
  return shadow;
}

function pinHost(node) {
  Object.keys(HOST_PROPS).forEach(function (key) {
    node.style.setProperty(key, HOST_PROPS[key], "important");
  });
}

function isCopy(payload) {
  return typeof payload.kicker === "string" &&
    typeof payload.message === "string" &&
    payload.kicker.length < 80 &&
    payload.message.length < 400 &&
    (payload.elapsedMs === undefined || typeof payload.elapsedMs === "number");
}

function extensionAlive() {
  try {
    return Boolean(chrome.runtime && chrome.runtime.id);
  } catch (err) {
    return false;
  }
}

function send(type) {
  return new Promise(function (resolve) {
    if (!extensionAlive()) {
      resolve(null);
      return;
    }
    try {
      chrome.runtime.sendMessage({ type: type }, function (response) {
        var failure = chrome.runtime.lastError;
        if (failure) resolve(null);
        else resolve(response || null);
      });
    } catch (err) {
      resolve(null);
    }
  });
}
