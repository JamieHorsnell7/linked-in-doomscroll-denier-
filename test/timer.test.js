"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadScrollSaver() {
  const context = {
    console,
    Object,
    URL,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    JSON,
    Error,
  };
  context.globalThis = context;
  vm.createContext(context);
  for (const file of ["config.js", "messages.js", "timer.js"]) {
    const code = fs.readFileSync(path.join(__dirname, "..", "src", file), "utf8");
    vm.runInContext(code, context, { filename: file });
  }
  return context.ScrollSaver;
}

let load;

test("shipped thresholds are 60 seconds then 5 minutes", () => {
  load = loadScrollSaver();
  assert.equal(load.CONFIG.INITIAL_THRESHOLD_MS, 60 * 1000);
  assert.equal(load.CONFIG.SNOOZE_THRESHOLD_MS, 5 * 60 * 1000);
  assert.ok(load.MESSAGES.length >= 4);
  const texts = load.MESSAGES.map((message) => message.text);
  assert.equal(new Set(texts).size, texts.length);
  assert.ok(texts[0].includes("football pitches"));
});

test("first nudge lands at 60 seconds of wall-clock time, not before", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  let step = load.applyHeartbeat(state, 0, config);
  assert.equal(step.action, "none");
  step = load.applyHeartbeat(step.state, 59999, config);
  assert.equal(step.action, "none");
  assert.equal(step.state.accumulatedMs, 59999);
  step = load.applyHeartbeat(step.state, 60000, config);
  assert.equal(step.action, "show");
  assert.equal(step.state.overlayVisible, true);
  assert.equal(step.state.shownElapsedMs, 60000);
});

test("overlapping LinkedIn tabs share one clock", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  state = load.applyHeartbeat(state, 1000, config).state;
  state = load.applyHeartbeat(state, 1100, config).state;
  const step = load.applyHeartbeat(state, 60000, config);
  assert.equal(step.state.accumulatedMs, 60000);
  assert.equal(step.action, "show");
});

test("unfocused ticks still count, sleep gaps do not", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  let step = load.applyHeartbeat(state, 30000, config);
  assert.equal(step.action, "none");
  step = load.applyHeartbeat(step.state, 60000, config);
  assert.equal(step.action, "show");

  state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  step = load.applyHeartbeat(state, config.MAX_GAP_MS + 1, config);
  assert.equal(step.state.accumulatedMs, 0);
  assert.equal(step.action, "none");
  step = load.applyHeartbeat(step.state, config.MAX_GAP_MS + 1 + 60000, config);
  assert.equal(step.action, "show");
  assert.equal(step.state.accumulatedMs, 60000);
});

test("Ignore waits another 5 minutes on LinkedIn, then rotates the joke", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  state = load.applyHeartbeat(state, 60000, config).state;
  assert.equal(state.overlayVisible, true);

  const parked = load.applyHeartbeat(state, 120000, config);
  assert.equal(parked.action, "none");
  assert.equal(parked.state.accumulatedMs, 60000);

  state = load.applyIgnore(state, 120000);
  assert.equal(state.phase, "snooze");
  assert.equal(state.overlayVisible, false);
  assert.equal(state.accumulatedMs, 0);
  assert.equal(state.messageIndex, 1);

  let now = 120000;
  let step = { state: state };
  for (let i = 0; i < 9; i += 1) {
    now += 30000;
    step = load.applyHeartbeat(step.state, now, config);
    assert.equal(step.action, "none");
  }
  assert.equal(step.state.accumulatedMs, 270000);
  now += 30000;
  step = load.applyHeartbeat(step.state, now, config);
  assert.equal(step.action, "show");
  assert.equal(step.state.shownElapsedMs, 5 * 60 * 1000);

  state = load.applyIgnore(step.state, 999);
  assert.equal(state.phase, "snooze");
  assert.equal(state.messageIndex, 2);
});

test("closing the tabs resets the next visit to the 60 second nudge", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  state = load.applyHeartbeat(state, 60000, config).state;
  state = load.applyIgnore(state, 60000);
  state = load.applyReset(state);
  assert.equal(state.phase, "initial");
  assert.equal(state.accumulatedMs, 0);
  assert.equal(state.overlayVisible, false);
  state = load.applyHeartbeat(state, 0, config).state;
  const step = load.applyHeartbeat(state, 60000, config);
  assert.equal(step.action, "show");
});

test("time away from LinkedIn does not keep accruing", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 1000, config).state;
  state = load.applyHeartbeat(state, 31000, config).state;
  assert.equal(state.accumulatedMs, 30000);
  state = load.pause(state);
  assert.equal(state.lastTick, null);
  state = load.applyHeartbeat(state, 31000 + 10 * 60 * 1000, config).state;
  assert.equal(state.accumulatedMs, 30000);
  const step = load.applyHeartbeat(state, 31000 + 10 * 60 * 1000 + 30000, config);
  assert.equal(step.action, "show");
});

test("stale messages cannot overwrite a newer Ignore", () => {
  load = loadScrollSaver();
  assert.equal(load.shouldApply(-1, 0), true);
  assert.equal(load.shouldApply(4, 4), true);
  assert.equal(load.shouldApply(5, 4), false);
  const config = load.CONFIG;
  let state = load.createState();
  state = load.applyHeartbeat(state, 0, config).state;
  const shown = load.applyHeartbeat(state, 60000, config).state;
  const ignored = load.applyIgnore(shown, 60000);
  assert.ok(ignored.revision > shown.revision);
  assert.equal(load.shouldApply(ignored.revision, shown.revision), false);
});

test("stored state drops junk and keeps a safe clock", () => {
  load = loadScrollSaver();
  const clean = load.normalizeState({
    accumulatedMs: 12000,
    lastTick: 50,
    phase: "snooze",
    overlayVisible: true,
    messageIndex: 3,
    distanceIndex: 4,
    shownDistanceIndex: 2,
    shownElapsedMs: 12000,
    revision: 9,
    message: "<script>",
  });
  assert.equal(clean.accumulatedMs, 12000);
  assert.equal(clean.phase, "snooze");
  assert.equal(clean.messageIndex, 3);
  assert.equal(clean.distanceIndex, 4);
  assert.equal(clean.shownDistanceIndex, 2);
  assert.equal(clean.revision, 9);
  assert.equal(clean.message, undefined);

  const garbage = load.normalizeState({
    accumulatedMs: -5,
    phase: "nope",
    messageIndex: -1,
    distanceIndex: -1,
    shownDistanceIndex: 5,
    revision: Number.POSITIVE_INFINITY,
  });
  assert.equal(garbage.accumulatedMs, 0);
  assert.equal(garbage.phase, "initial");
  assert.equal(garbage.messageIndex, 0);
  assert.equal(garbage.distanceIndex, 0);
  assert.equal(garbage.shownDistanceIndex, 0);
  assert.equal(garbage.revision, 0);
});

test("the scroll-distance joke changes every time the popup shows", () => {
  load = loadScrollSaver();
  const jokes = load.DISTANCE_JOKES;
  assert.equal(jokes.length, 5);
  const bodies = jokes.map((joke) => joke.text);
  assert.equal(new Set(bodies).size, 5);
  assert.equal(bodies[0], load.MESSAGES[0].text);
  assert.ok(bodies.some((text) => text.includes("Eiffel Towers")));
  assert.ok(bodies.some((text) => text.includes("London buses")));
  for (const joke of jokes) {
    assert.ok(joke.kicker.length < 80);
    assert.ok(joke.text.length < 400);
  }

  const background = fs.readFileSync(path.join(__dirname, "..", "src", "background.js"), "utf8");
  assert.ok(background.includes("ScrollSaver.jokeFor"));

  const config = load.CONFIG;
  let state = load.createState();
  let now = 0;
  const shown = [];

  function reveal() {
    let step = load.applyHeartbeat(state, now, config);
    state = step.state;
    while (step.action !== "show") {
      now += 30000;
      step = load.applyHeartbeat(state, now, config);
      state = step.state;
      assert.ok(now < 60 * 60 * 1000, "popup did not show");
    }
    shown.push(load.jokeFor(state).text);
    const parked = load.applyHeartbeat(state, now + 1000, config);
    assert.equal(parked.action, "none");
    assert.equal(parked.state.shownDistanceIndex, state.shownDistanceIndex);
    assert.equal(parked.state.distanceIndex, state.distanceIndex);
    assert.equal(load.jokeFor(parked.state).text, load.jokeFor(state).text);
    state = load.applyIgnore(parked.state, now + 1000);
    now += 1000;
  }

  reveal();
  for (let i = 0; i < 5; i += 1) reveal();

  assert.deepEqual(shown, [...bodies, bodies[0]]);
  for (let i = 1; i < shown.length; i += 1) {
    assert.notEqual(shown[i], shown[i - 1]);
  }
});

test("closing LinkedIn does not bring the same distance joke straight back", () => {
  load = loadScrollSaver();
  const config = load.CONFIG;
  let state = load.createState();
  let step = load.applyHeartbeat(state, 0, config);
  step = load.applyHeartbeat(step.state, 60000, config);
  assert.equal(step.action, "show");
  assert.equal(load.jokeFor(step.state).text, load.DISTANCE_JOKES[0].text);

  state = load.applyReset(step.state);
  assert.equal(state.phase, "initial");
  assert.equal(state.overlayVisible, false);
  assert.equal(state.distanceIndex, 1);

  step = load.applyHeartbeat(state, 0, config);
  step = load.applyHeartbeat(step.state, 60000, config);
  assert.equal(step.action, "show");
  assert.equal(load.jokeFor(step.state).text, load.DISTANCE_JOKES[1].text);
});
