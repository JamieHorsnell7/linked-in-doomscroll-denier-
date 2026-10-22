"use strict";

var host = document.createElement("div");
host.id = "scrollsaver-host";
var hostStyle = {
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
Object.keys(hostStyle).forEach(function (key) {
  host.style.setProperty(key, hostStyle[key], "important");
});

var shadow = host.attachShadow({ mode: "closed" });
document.documentElement.appendChild(host);

var copy = ScrollSaver.MESSAGES[0];
ScrollSaver.mountOverlay(shadow, {
  kicker: copy.kicker,
  message: copy.text,
  elapsedMs: 60000,
  snoozeMs: ScrollSaver.CONFIG.SNOOZE_THRESHOLD_MS,
  onIgnore: function () {},
  onClose: function () {},
});
