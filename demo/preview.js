"use strict";

var host = document.createElement("div");
host.id = "scrollhog-host";
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

var copy = Scrollhog.MESSAGES[0];
Scrollhog.mountOverlay(shadow, {
  kicker: copy.kicker,
  message: copy.text,
  elapsedMs: 60000,
  snoozeMs: Scrollhog.CONFIG.SNOOZE_THRESHOLD_MS,
  onIgnore: function () {},
  onClose: function () {},
});
