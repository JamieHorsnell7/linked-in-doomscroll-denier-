"use strict";

// Timing knobs for ScrollSaver. Reload the extension after editing.
// Drop these while you are testing, then put the real durations back:
//   INITIAL_THRESHOLD_MS: 60 * 1000
//   SNOOZE_THRESHOLD_MS: 5 * 60 * 1000
var ScrollSaver = ScrollSaver || {};

ScrollSaver.CONFIG = Object.freeze({
  INITIAL_THRESHOLD_MS: 60 * 1000,
  SNOOZE_THRESHOLD_MS: 5 * 60 * 1000,
  HEARTBEAT_MS: 1000,
  // Background tabs and alarms can wake late. Count that gap.
  // Longer holes (sleep, a closed laptop) are not time on LinkedIn.
  MAX_GAP_MS: 75 * 1000,
});
