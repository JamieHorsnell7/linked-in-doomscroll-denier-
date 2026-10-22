"use strict";

var ScrollSaver = ScrollSaver || {};

var SVG_NS = "http://www.w3.org/2000/svg";
var NAVY = "#1c2340";
var RED = "#e10600";
var SKIN = "#ffd8bf";
var SUIT = "#3b82f6";

var OVERLAY_CSS = [
  ".root {",
  "  all: initial;",
  "  display: block;",
  "  box-sizing: border-box;",
  "  pointer-events: auto;",
  "  color: #1c2340;",
  "  color-scheme: light;",
  "  font-family: 'Trebuchet MS', 'Segoe UI', Helvetica, Arial, sans-serif;",
  "  font-size: 16px;",
  "  line-height: 1.35;",
  "  -webkit-font-smoothing: antialiased;",
  "}",
  ".card {",
  "  position: relative;",
  "  box-sizing: border-box;",
  "  display: block;",
  "  width: 100%;",
  "  padding: 16px 18px 14px;",
  "  border: 3px solid #1c2340;",
  "  border-radius: 28px;",
  "  background: linear-gradient(180deg, #f8fbff 0%, #e4f0ff 100%);",
  "  box-shadow: 0 14px 34px rgba(28, 35, 64, 0.16), 0 0 0 3px #e10600;",
  "  animation: scrollsaver-arrive 420ms cubic-bezier(0.2, 0.9, 0.2, 1) both, scrollsaver-flash 1.5s ease-in-out 420ms infinite;",
  "}",
  ".stripe {",
  "  height: 8px;",
  "  margin: -16px -18px 14px;",
  "  border-bottom: 3px solid #1c2340;",
  "  border-radius: 24px 24px 0 0;",
  "  background-image: repeating-linear-gradient(90deg, #e10600 0 12px, #ffffff 12px 18px, #7eb6ff 18px 30px, #ffffff 30px 36px);",
  "  background-size: 72px 8px;",
  "  animation: scrollsaver-march 1.1s linear infinite;",
  "}",
  ".top {",
  "  display: flex;",
  "  align-items: center;",
  "  justify-content: space-between;",
  "  gap: 12px;",
  "}",
  ".brand {",
  "  display: flex;",
  "  align-items: center;",
  "  gap: 8px;",
  "  margin: 0;",
  "  font-size: 13px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.08em;",
  "  text-transform: uppercase;",
  "}",
  ".dot {",
  "  width: 10px;",
  "  height: 10px;",
  "  border-radius: 999px;",
  "  background: #e10600;",
  "  box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.2);",
  "  animation: scrollsaver-dot 1.5s ease-in-out infinite;",
  "}",
  ".pill {",
  "  margin: 0;",
  "  padding: 4px 8px;",
  "  border: 2px solid #1c2340;",
  "  border-radius: 999px;",
  "  background: #fff;",
  "  font-size: 10px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.08em;",
  "  text-transform: uppercase;",
  "}",
  ".stage {",
  "  display: flex;",
  "  justify-content: center;",
  "  margin: 0;",
  "}",
  ".hero {",
  "  width: 156px;",
  "  height: 124px;",
  "  overflow: visible;",
  "  transform-origin: 50% 80%;",
  "  animation: scrollsaver-bob 2.6s ease-in-out infinite;",
  "}",
  ".cape {",
  "  transform-origin: 100px 78px;",
  "  animation: scrollsaver-cape 1.8s ease-in-out infinite;",
  "}",
  ".eye {",
  "  transform-box: fill-box;",
  "  transform-origin: center;",
  "  animation: scrollsaver-blink 4.2s infinite;",
  "}",
  ".wave {",
  "  transform-origin: 142px 112px;",
  "  animation: scrollsaver-wave 1.6s ease-in-out infinite;",
  "}",
  ".stamp {",
  "  position: absolute;",
  "  top: 58px;",
  "  right: 16px;",
  "  margin: 0;",
  "  padding: 4px 7px;",
  "  border: 2px solid #e10600;",
  "  border-radius: 8px;",
  "  color: #e10600;",
  "  background: rgba(255, 255, 255, 0.82);",
  "  font-size: 11px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.14em;",
  "  transform: rotate(8deg);",
  "  animation: scrollsaver-stamp 1.5s ease-in-out infinite;",
  "}",
  ".kicker {",
  "  margin: 0;",
  "  color: #c41018;",
  "  font-size: 11px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.14em;",
  "  text-transform: uppercase;",
  "}",
  ".message {",
  "  min-height: 4.5em;",
  "  margin: 6px 0 0;",
  "  font-size: 22px;",
  "  font-weight: 800;",
  "  letter-spacing: -0.02em;",
  "  line-height: 1.25;",
  "}",
  ".clock {",
  "  display: inline-block;",
  "  margin: 10px 0 0;",
  "  padding: 3px 8px;",
  "  border-radius: 999px;",
  "  background: #1c2340;",
  "  color: #f8fbff;",
  "  font-size: 12px;",
  "  font-weight: 800;",
  "}",
  ".actions {",
  "  display: flex;",
  "  gap: 10px;",
  "  margin-top: 14px;",
  "}",
  "button {",
  "  all: initial;",
  "  box-sizing: border-box;",
  "  flex: 1 1 0;",
  "  min-height: 52px;",
  "  padding: 10px 12px;",
  "  border: 3px solid #1c2340;",
  "  border-radius: 16px;",
  "  font-family: 'Trebuchet MS', 'Segoe UI', Helvetica, Arial, sans-serif;",
  "  font-size: 16px;",
  "  font-weight: 800;",
  "  line-height: 1.1;",
  "  text-align: center;",
  "  cursor: pointer;",
  "}",
  "button small {",
  "  display: block;",
  "  margin-top: 3px;",
  "  font-size: 10px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.04em;",
  "  text-transform: uppercase;",
  "}",
  ".ignore {",
  "  background: #ffffff;",
  "  color: #1c2340;",
  "  box-shadow: 0 6px 0 #b9d4ff;",
  "}",
  ".close {",
  "  background: #1c2340;",
  "  color: #f8fbff;",
  "  box-shadow: 0 6px 0 #e10600;",
  "}",
  "button:hover { transform: translateY(-1px); }",
  "button:active { transform: translateY(2px); box-shadow: 0 0 0 #e10600; }",
  "button:focus-visible { outline: 3px solid #e10600; outline-offset: 3px; }",
  ".fine {",
  "  margin: 12px 0 0;",
  "  color: #3d4766;",
  "  font-size: 12px;",
  "  line-height: 1.4;",
  "}",
  "@keyframes scrollsaver-arrive {",
  "  from { transform: translateY(-18px) scale(0.97) rotate(-1deg); }",
  "  to { transform: translateY(0) scale(1) rotate(0deg); }",
  "}",
  "@keyframes scrollsaver-flash {",
  "  0%, 100% { box-shadow: 0 14px 34px rgba(28, 35, 64, 0.16), 0 0 0 3px #e10600; }",
  "  50% { box-shadow: 0 14px 34px rgba(28, 35, 64, 0.16), 0 0 0 7px #ffb1a6; }",
  "}",
  "@keyframes scrollsaver-march {",
  "  from { background-position: 0 0; }",
  "  to { background-position: 72px 0; }",
  "}",
  "@keyframes scrollsaver-dot {",
  "  0%, 100% { background: #e10600; box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.18); }",
  "  50% { background: #ff8d84; box-shadow: 0 0 0 6px rgba(225, 6, 0, 0.08); }",
  "}",
  "@keyframes scrollsaver-bob {",
  "  0%, 100% { transform: translateY(0) rotate(-2deg); }",
  "  50% { transform: translateY(-7px) rotate(2deg); }",
  "}",
  "@keyframes scrollsaver-cape {",
  "  0%, 100% { transform: rotate(-6deg) scaleX(1); }",
  "  50% { transform: rotate(6deg) scaleX(1.04); }",
  "}",
  "@keyframes scrollsaver-blink {",
  "  0%, 42%, 48%, 100% { transform: scaleY(1); }",
  "  45% { transform: scaleY(0.08); }",
  "}",
  "@keyframes scrollsaver-wave {",
  "  0%, 100% { transform: rotate(-8deg); }",
  "  50% { transform: rotate(14deg); }",
  "}",
  "@keyframes scrollsaver-stamp {",
  "  0%, 100% { opacity: 1; }",
  "  50% { opacity: 0.45; }",
  "}",
  "@media (prefers-reduced-motion: reduce) {",
  "  .card, .stripe, .dot, .hero, .cape, .eye, .wave, .stamp { animation: none; }",
  "  .card { box-shadow: 0 14px 34px rgba(28, 35, 64, 0.16), 0 0 0 4px #e10600; }",
  "}",
].join("\n");

ScrollSaver.mountOverlay = function (shadow, options) {
  clearNode(shadow);

  var sheet = new CSSStyleSheet();
  sheet.replaceSync(OVERLAY_CSS);
  shadow.adoptedStyleSheets = [sheet];

  var root = el("div", "root");
  var card = el("section", "card");
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "false");
  card.setAttribute("aria-labelledby", "scrollsaver-title");

  card.appendChild(el("div", "stripe"));

  var top = el("div", "top");
  var brand = el("p", "brand");
  brand.appendChild(el("span", "dot"));
  brand.appendChild(document.createTextNode("Scroll Saver"));
  var pill = el("p", "pill");
  pill.textContent = "Live intervention";
  top.appendChild(brand);
  top.appendChild(pill);
  card.appendChild(top);

  var stage = el("div", "stage");
  stage.appendChild(createHero());
  card.appendChild(stage);

  var stamp = el("p", "stamp");
  stamp.textContent = "LOG OFF";
  card.appendChild(stamp);

  var kicker = el("p", "kicker");
  kicker.textContent = options.kicker;
  card.appendChild(kicker);

  var message = el("p", "message");
  message.id = "scrollsaver-title";
  message.textContent = options.message;
  card.appendChild(message);

  var clock = el("p", "clock");
  clock.textContent = formatElapsed(options.elapsedMs);
  card.appendChild(clock);

  var actions = el("div", "actions");
  var ignore = button("ignore", "Ignore", "snooze " + formatDuration(options.snoozeMs));
  var close = button("close", "Close", "every LinkedIn tab");
  ignore.setAttribute("aria-describedby", "scrollsaver-title");
  ignore.addEventListener("click", function (event) {
    event.preventDefault();
    options.onIgnore();
  });
  close.addEventListener("click", function (event) {
    event.preventDefault();
    options.onClose();
  });
  actions.appendChild(ignore);
  actions.appendChild(close);
  card.appendChild(actions);

  var fine = el("p", "fine");
  fine.textContent =
    "Ignore hides this and brings it back after another " +
    formatDuration(options.snoozeMs) +
    " on LinkedIn. Close shuts every LinkedIn tab. Escape ignores, too.";
  card.appendChild(fine);

  root.appendChild(card);
  shadow.appendChild(root);
  try {
    ignore.focus({ preventScroll: true });
  } catch (err) {
    // Focus can fail if the host is not in a document yet.
  }

  return {
    destroy: function () {
      clearNode(shadow);
    },
  };
};

ScrollSaver.formatDuration = formatDuration;
ScrollSaver.formatElapsed = formatElapsed;

function createHero() {
  var svg = svgEl("svg", {
    class: "hero",
    viewBox: "0 0 200 160",
    role: "img",
    "aria-label": "Scroll Saver, a round smiling cartoon with a small red cape",
  });

  svg.appendChild(shape("ellipse", {
    cx: "100", cy: "148", rx: "46", ry: "6", fill: NAVY, opacity: "0.12",
  }));

  var cape = svgEl("g", { class: "cape" });
  cape.appendChild(shape("path", {
    d: "M78 84 C36 96 28 132 62 150 C80 128 92 112 98 92 Z",
    fill: RED,
    stroke: NAVY,
    "stroke-width": "3",
    "stroke-linejoin": "round",
  }));
  cape.appendChild(shape("path", {
    d: "M122 84 C164 96 172 132 138 150 C120 128 108 112 102 92 Z",
    fill: RED,
    stroke: NAVY,
    "stroke-width": "3",
    "stroke-linejoin": "round",
  }));
  svg.appendChild(cape);

  svg.appendChild(shape("ellipse", {
    cx: "100", cy: "118", rx: "36", ry: "28", fill: SUIT, stroke: NAVY, "stroke-width": "3",
  }));
  svg.appendChild(shape("polygon", {
    points: "100,104 104,112 112,113 106,118 108,126 100,122 92,126 94,118 88,113 96,112",
    fill: "#fff",
    stroke: NAVY,
    "stroke-width": "2",
    "stroke-linejoin": "round",
  }));

  var wave = svgEl("g", { class: "wave" });
  wave.appendChild(shape("line", {
    x1: "128", y1: "112", x2: "150", y2: "96",
    stroke: NAVY, "stroke-width": "4", "stroke-linecap": "round",
  }));
  wave.appendChild(shape("circle", {
    cx: "154", cy: "92", r: "8", fill: SKIN, stroke: NAVY, "stroke-width": "3",
  }));
  svg.appendChild(wave);

  svg.appendChild(shape("circle", {
    cx: "100", cy: "74", r: "34", fill: SKIN, stroke: NAVY, "stroke-width": "3",
  }));
  svg.appendChild(shape("path", {
    d: "M70 66 Q86 42 100 50 Q114 42 130 66 Q114 54 100 58 Q86 54 70 66 Z",
    fill: NAVY,
  }));
  svg.appendChild(shape("circle", {
    cx: "86", cy: "74", r: "5.5", fill: NAVY, class: "eye",
  }));
  svg.appendChild(shape("circle", {
    cx: "114", cy: "74", r: "5.5", fill: NAVY, class: "eye",
  }));
  svg.appendChild(shape("circle", { cx: "88", cy: "72", r: "1.6", fill: "#fff" }));
  svg.appendChild(shape("circle", { cx: "116", cy: "72", r: "1.6", fill: "#fff" }));
  svg.appendChild(shape("path", {
    d: "M78 86 Q100 112 122 86",
    fill: "none",
    stroke: NAVY,
    "stroke-width": "4",
    "stroke-linecap": "round",
  }));
  svg.appendChild(shape("circle", { cx: "74", cy: "86", r: "5", fill: "#ff8f86", opacity: "0.9" }));
  svg.appendChild(shape("circle", { cx: "126", cy: "86", r: "5", fill: "#ff8f86", opacity: "0.9" }));
  return svg;
}

function button(className, label, hint) {
  var node = el("button", className);
  node.type = "button";
  node.appendChild(document.createTextNode(label));
  var small = el("small");
  small.textContent = hint;
  node.appendChild(small);
  return node;
}

function formatElapsed(ms) {
  var total = Math.max(0, Math.round((Number(ms) || 0) / 1000));
  var minutes = Math.floor(total / 60);
  var seconds = total % 60;
  if (minutes <= 0) return seconds + " sec on LinkedIn";
  if (seconds === 0) return minutes + " min on LinkedIn";
  return minutes + " min " + seconds + " sec on LinkedIn";
}

function formatDuration(ms) {
  var value = Number(ms);
  if (!Number.isFinite(value) || value < 0) return "a bit";
  if (value < 60000) {
    var seconds = Math.max(1, Math.round(value / 1000));
    return seconds + (seconds === 1 ? " second" : " seconds");
  }
  var minutes = Math.round(value / 60000);
  return minutes + (minutes === 1 ? " minute" : " minutes");
}

function el(tag, className) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function svgEl(tag, attrs) {
  var node = document.createElementNS(SVG_NS, tag);
  applyAttrs(node, attrs);
  return node;
}

function shape(tag, attrs) {
  return svgEl(tag, attrs);
}

function applyAttrs(node, attrs) {
  if (!attrs) return;
  Object.keys(attrs).forEach(function (key) {
    node.setAttribute(key, attrs[key]);
  });
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  if ("adoptedStyleSheets" in node) node.adoptedStyleSheets = [];
}
