"use strict";

var ScrollSaver = ScrollSaver || {};

// Wall clock while any LinkedIn tab is open. Two tabs do not count twice.
// lastTick null means the clock is paused (no LinkedIn tabs, or not started).

ScrollSaver.createState = function () {
  return {
    accumulatedMs: 0,
    lastTick: null,
    phase: "initial",
    overlayVisible: false,
    messageIndex: 0,
    distanceIndex: 0,
    shownDistanceIndex: 0,
    shownElapsedMs: 0,
    revision: 0,
  };
};

ScrollSaver.cloneState = function (state) {
  return {
    accumulatedMs: state.accumulatedMs,
    lastTick: state.lastTick,
    phase: state.phase,
    overlayVisible: state.overlayVisible,
    messageIndex: state.messageIndex,
    distanceIndex: state.distanceIndex,
    shownDistanceIndex: state.shownDistanceIndex,
    shownElapsedMs: state.shownElapsedMs,
    revision: state.revision,
  };
};

ScrollSaver.thresholdFor = function (state, config) {
  if (state.phase === "snooze") return config.SNOOZE_THRESHOLD_MS;
  return config.INITIAL_THRESHOLD_MS;
};

ScrollSaver.normalizeState = function (raw) {
  var next = ScrollSaver.createState();
  if (!raw || typeof raw !== "object") return next;

  if (isSafeDuration(raw.accumulatedMs)) next.accumulatedMs = raw.accumulatedMs;
  if (raw.phase === "initial" || raw.phase === "snooze") next.phase = raw.phase;
  if (raw.overlayVisible === true) next.overlayVisible = true;
  if (isSafeDuration(raw.shownElapsedMs)) next.shownElapsedMs = raw.shownElapsedMs;
  if (typeof raw.lastTick === "number" && Number.isFinite(raw.lastTick)) {
    next.lastTick = raw.lastTick;
  }
  if (isIndex(raw.messageIndex)) next.messageIndex = Math.floor(raw.messageIndex);
  if (isIndex(raw.distanceIndex)) next.distanceIndex = Math.floor(raw.distanceIndex);
  if (isIndex(raw.shownDistanceIndex)) {
    next.shownDistanceIndex = Math.floor(raw.shownDistanceIndex);
  }
  if (isIndex(raw.revision)) next.revision = Math.floor(raw.revision);
  if (ScrollSaver.MESSAGES && ScrollSaver.MESSAGES.length) {
    next.messageIndex = next.messageIndex % ScrollSaver.MESSAGES.length;
  }
  next.distanceIndex = next.distanceIndex % distanceCount();
  next.shownDistanceIndex = next.shownDistanceIndex % distanceCount();
  return next;
};

ScrollSaver.applyHeartbeat = function (state, now, config) {
  var next = ScrollSaver.cloneState(state);
  next.revision = state.revision + 1;

  if (typeof now !== "number" || !Number.isFinite(now)) {
    return { state: next, action: "none" };
  }

  if (next.overlayVisible) {
    next.lastTick = now;
    return { state: next, action: "none" };
  }

  if (next.lastTick === null) {
    next.lastTick = now;
    return { state: next, action: "none" };
  }

  var delta = now - next.lastTick;
  if (delta < 0 || delta > config.MAX_GAP_MS) {
    next.lastTick = now;
    return finishIfDue(next, config);
  }

  if (delta > 0) {
    next.accumulatedMs += delta;
    next.lastTick = now;
  }

  return finishIfDue(next, config);
};

ScrollSaver.pause = function (state) {
  var next = ScrollSaver.cloneState(state);
  next.revision = state.revision + 1;
  next.lastTick = null;
  return next;
};

ScrollSaver.applyIgnore = function (state, now) {
  var count = ScrollSaver.MESSAGES.length || 1;
  var next = ScrollSaver.cloneState(state);
  next.revision = state.revision + 1;
  next.accumulatedMs = 0;
  next.lastTick = now;
  next.phase = "snooze";
  next.overlayVisible = false;
  next.shownElapsedMs = 0;
  next.messageIndex = (state.messageIndex + 1) % count;
  return next;
};

ScrollSaver.applyReset = function (state) {
  var next = ScrollSaver.createState();
  next.revision = (state && state.revision ? state.revision : 0) + 1;
  // The next visit should not open on the joke that was just on screen.
  if (state && isIndex(state.distanceIndex)) {
    next.distanceIndex = Math.floor(state.distanceIndex) % distanceCount();
  }
  return next;
};

ScrollSaver.jokeFor = function (state) {
  var jokes = ScrollSaver.DISTANCE_JOKES;
  if (!jokes || !jokes.length) return ScrollSaver.MESSAGES[0];
  var index = state && state.overlayVisible ? state.shownDistanceIndex : state && state.distanceIndex;
  if (!isIndex(index)) index = 0;
  return jokes[Math.floor(index) % jokes.length];
};

ScrollSaver.shouldApply = function (localRevision, remoteRevision) {
  return typeof remoteRevision === "number" &&
    Number.isFinite(remoteRevision) &&
    remoteRevision >= localRevision;
};

function finishIfDue(state, config) {
  if (!state.overlayVisible && state.accumulatedMs >= ScrollSaver.thresholdFor(state, config)) {
    state.overlayVisible = true;
    state.shownElapsedMs = state.accumulatedMs;
    lockDistanceJoke(state);
    return { state: state, action: "show" };
  }
  return { state: state, action: "none" };
}

function lockDistanceJoke(state) {
  var count = distanceCount();
  var current = isIndex(state.distanceIndex) ? Math.floor(state.distanceIndex) % count : 0;
  state.shownDistanceIndex = current;
  state.distanceIndex = (current + 1) % count;
}

function distanceCount() {
  var jokes = ScrollSaver.DISTANCE_JOKES;
  return jokes && jokes.length ? jokes.length : 1;
}

function isSafeDuration(value) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 12 * 60 * 60 * 1000;
}

function isIndex(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 1e12;
}
