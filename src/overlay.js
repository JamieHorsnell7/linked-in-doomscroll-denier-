"use strict";

var Scrollhog = Scrollhog || {};

var SVG_NS = "http://www.w3.org/2000/svg";

var OVERLAY_CSS = [
  ".root {",
  "  all: initial;",
  "  display: block;",
  "  box-sizing: border-box;",
  "  pointer-events: auto;",
  "  color: #1b1714;",
  "  color-scheme: light;",
  "  font-family: Georgia, 'Iowan Old Style', Palatino, 'Palatino Linotype', 'Times New Roman', serif;",
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
  "  border: 3px solid #1b1714;",
  "  border-radius: 22px;",
  "  background:",
  "    radial-gradient(circle at 12% 0%, rgba(255, 200, 87, 0.55), transparent 28%),",
  "    radial-gradient(circle at 100% 100%, rgba(225, 6, 0, 0.08), transparent 32%),",
  "    #fff6ea;",
  "  box-shadow: 8px 8px 0 #1b1714, 0 0 0 3px #e10600;",
  "  animation: scrollhog-arrive 420ms cubic-bezier(0.2, 0.9, 0.2, 1) both, scrollhog-flash 1.5s ease-in-out 420ms infinite;",
  "}",
  ".stripe {",
  "  height: 8px;",
  "  margin: -16px -18px 14px;",
  "  border-bottom: 3px solid #1b1714;",
  "  border-radius: 18px 18px 0 0;",
  "  background-image: repeating-linear-gradient(90deg, #e10600 0 14px, #1b1714 14px 20px, #ffc857 20px 34px, #1b1714 34px 40px);",
  "  background-size: 80px 8px;",
  "  animation: scrollhog-march 1.1s linear infinite;",
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
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 12px;",
  "  font-weight: 700;",
  "  letter-spacing: 0.16em;",
  "  text-transform: uppercase;",
  "}",
  ".dot {",
  "  width: 10px;",
  "  height: 10px;",
  "  border-radius: 999px;",
  "  background: #e10600;",
  "  box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.2);",
  "  animation: scrollhog-dot 1.5s ease-in-out infinite;",
  "}",
  ".pill {",
  "  margin: 0;",
  "  padding: 4px 8px;",
  "  border: 2px solid #1b1714;",
  "  border-radius: 999px;",
  "  background: #fff;",
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 10px;",
  "  font-weight: 700;",
  "  letter-spacing: 0.08em;",
  "  text-transform: uppercase;",
  "}",
  ".stage {",
  "  display: flex;",
  "  justify-content: center;",
  "  margin: 2px 0 0;",
  "}",
  ".hog {",
  "  width: 148px;",
  "  height: 118px;",
  "  overflow: visible;",
  "  transform-origin: 50% 80%;",
  "  animation: scrollhog-bob 2.6s ease-in-out infinite;",
  "}",
  ".quills {",
  "  transform-origin: 100px 90px;",
  "  animation: scrollhog-sway 2.2s ease-in-out infinite;",
  "}",
  ".eye {",
  "  transform-box: fill-box;",
  "  transform-origin: center;",
  "  animation: scrollhog-blink 4.2s infinite;",
  "}",
  ".flag {",
  "  transform-origin: 78px 112px;",
  "  animation: scrollhog-flag 1.8s ease-in-out infinite;",
  "}",
  ".stamp {",
  "  position: absolute;",
  "  top: 58px;",
  "  right: 16px;",
  "  margin: 0;",
  "  padding: 4px 7px;",
  "  border: 2px solid #e10600;",
  "  border-radius: 6px;",
  "  color: #e10600;",
  "  background: rgba(255, 246, 234, 0.72);",
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 11px;",
  "  font-weight: 800;",
  "  letter-spacing: 0.14em;",
  "  transform: rotate(8deg);",
  "  animation: scrollhog-stamp 1.5s ease-in-out infinite;",
  "}",
  ".kicker {",
  "  margin: 0;",
  "  color: #9f0d16;",
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 11px;",
  "  font-weight: 700;",
  "  letter-spacing: 0.14em;",
  "  text-transform: uppercase;",
  "}",
  ".message {",
  "  min-height: 4.5em;",
  "  margin: 6px 0 0;",
  "  font-size: 23px;",
  "  font-weight: 700;",
  "  letter-spacing: -0.02em;",
  "  line-height: 1.22;",
  "}",
  ".clock {",
  "  display: inline-block;",
  "  margin: 10px 0 0;",
  "  padding: 3px 8px;",
  "  border-radius: 999px;",
  "  background: #1b1714;",
  "  color: #fff6ea;",
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 12px;",
  "  font-weight: 700;",
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
  "  border: 3px solid #1b1714;",
  "  border-radius: 14px;",
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
  "  font-family: ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Menlo, Consolas, monospace;",
  "  font-size: 10px;",
  "  font-weight: 700;",
  "  letter-spacing: 0.04em;",
  "  text-transform: uppercase;",
  "}",
  ".ignore {",
  "  background: #ffc857;",
  "  color: #1b1714;",
  "  box-shadow: 4px 4px 0 #1b1714;",
  "}",
  ".close {",
  "  background: #1b1714;",
  "  color: #fff6ea;",
  "  box-shadow: 4px 4px 0 #e10600;",
  "}",
  "button:hover { transform: translate(-1px, -1px); }",
  "button:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #1b1714; }",
  "button:focus-visible { outline: 3px solid #e10600; outline-offset: 3px; }",
  ".fine {",
  "  margin: 12px 0 0;",
  "  color: #4a433c;",
  "  font-family: 'Trebuchet MS', 'Segoe UI', Helvetica, Arial, sans-serif;",
  "  font-size: 12px;",
  "  line-height: 1.4;",
  "}",
  "@keyframes scrollhog-arrive {",
  "  from { transform: translateY(-18px) scale(0.97) rotate(-1deg); }",
  "  to { transform: translateY(0) scale(1) rotate(0deg); }",
  "}",
  "@keyframes scrollhog-flash {",
  "  0%, 100% { box-shadow: 8px 8px 0 #1b1714, 0 0 0 3px #e10600; }",
  "  50% { box-shadow: 8px 8px 0 #1b1714, 0 0 0 6px #ffb1a6; }",
  "}",
  "@keyframes scrollhog-march {",
  "  from { background-position: 0 0; }",
  "  to { background-position: 80px 0; }",
  "}",
  "@keyframes scrollhog-dot {",
  "  0%, 100% { background: #e10600; box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.18); }",
  "  50% { background: #ff8d84; box-shadow: 0 0 0 6px rgba(225, 6, 0, 0.08); }",
  "}",
  "@keyframes scrollhog-bob {",
  "  0%, 100% { transform: translateY(0) rotate(-2deg); }",
  "  50% { transform: translateY(-7px) rotate(2deg); }",
  "}",
  "@keyframes scrollhog-sway {",
  "  0%, 100% { transform: rotate(-3deg); }",
  "  50% { transform: rotate(4deg); }",
  "}",
  "@keyframes scrollhog-blink {",
  "  0%, 42%, 48%, 100% { transform: scaleY(1); }",
  "  45% { transform: scaleY(0.08); }",
  "}",
  "@keyframes scrollhog-flag {",
  "  0%, 100% { transform: rotate(-8deg); }",
  "  50% { transform: rotate(7deg); }",
  "}",
  "@keyframes scrollhog-stamp {",
  "  0%, 100% { opacity: 1; }",
  "  50% { opacity: 0.45; }",
  "}",
  "@media (prefers-reduced-motion: reduce) {",
  "  .card, .stripe, .dot, .hog, .quills, .eye, .flag, .stamp { animation: none; }",
  "  .card { box-shadow: 8px 8px 0 #1b1714, 0 0 0 4px #e10600; }",
  "}",
].join("\n");

Scrollhog.mountOverlay = function (shadow, options) {
  clearNode(shadow);

  var sheet = new CSSStyleSheet();
  sheet.replaceSync(OVERLAY_CSS);
  shadow.adoptedStyleSheets = [sheet];

  var root = el("div", "root");
  var card = el("section", "card");
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "false");
  card.setAttribute("aria-labelledby", "scrollhog-title");

  card.appendChild(el("div", "stripe"));

  var top = el("div", "top");
  var brand = el("p", "brand");
  brand.appendChild(el("span", "dot"));
  brand.appendChild(document.createTextNode("Scrollhog"));
  var pill = el("p", "pill");
  pill.textContent = "Live intervention";
  top.appendChild(brand);
  top.appendChild(pill);
  card.appendChild(top);

  var stage = el("div", "stage");
  stage.appendChild(createHog());
  card.appendChild(stage);

  var stamp = el("p", "stamp");
  stamp.textContent = "LOG OFF";
  card.appendChild(stamp);

  var kicker = el("p", "kicker");
  kicker.textContent = options.kicker;
  card.appendChild(kicker);

  var message = el("p", "message");
  message.id = "scrollhog-title";
  message.textContent = options.message;
  card.appendChild(message);

  var clock = el("p", "clock");
  clock.textContent = formatElapsed(options.elapsedMs);
  card.appendChild(clock);

  var actions = el("div", "actions");
  var ignore = button("ignore", "Ignore", "snooze " + formatDuration(options.snoozeMs));
  var close = button("close", "Close", "every LinkedIn tab");
  ignore.setAttribute("aria-describedby", "scrollhog-title");
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

Scrollhog.formatDuration = formatDuration;
Scrollhog.formatElapsed = formatElapsed;

function createHog() {
  var svg = svgEl("svg", {
    class: "hog",
    viewBox: "0 0 200 150",
    role: "img",
    "aria-label": "A round hedgehog holding a tiny red flag",
  });

  var quills = svgEl("g", { class: "quills" });
  [
    [78, 78, -36, "#c4512b"],
    [96, 62, -12, "#8a3d22"],
    [116, 58, 6, "#c4512b"],
    [136, 68, 24, "#8a3d22"],
    [68, 98, -58, "#a34728"],
    [148, 88, 42, "#c4512b"],
    [86, 70, -24, "#e07a45"],
  ].forEach(function (spike) {
    quills.appendChild(spikeAt(spike[0], spike[1], spike[2], spike[3]));
  });
  svg.appendChild(quills);

  svg.appendChild(shape("ellipse", {
    cx: "108", cy: "146", rx: "46", ry: "6", fill: "#1b1714", opacity: "0.12",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "112", cy: "104", rx: "54", ry: "40", fill: "#f3c7a4", stroke: "#1b1714", "stroke-width": "3",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "122", cy: "116", rx: "30", ry: "22", fill: "#ffe6cf", stroke: "#1b1714", "stroke-width": "2",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "74", cy: "96", rx: "14", ry: "16", fill: "#f3c7a4", stroke: "#1b1714", "stroke-width": "3",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "74", cy: "98", rx: "6", ry: "8", fill: "#ef8d86",
  }));

  var flag = svgEl("g", { class: "flag" });
  flag.appendChild(shape("line", {
    x1: "78", y1: "116", x2: "62", y2: "64", stroke: "#1b1714", "stroke-width": "3", "stroke-linecap": "round",
  }));
  flag.appendChild(shape("polygon", {
    points: "62,64 98,72 62,84", fill: "#e10600", stroke: "#1b1714", "stroke-width": "2", "stroke-linejoin": "round",
  }));
  svg.appendChild(flag);

  svg.appendChild(shape("ellipse", {
    cx: "80", cy: "118", rx: "10", ry: "7", fill: "#e7a57a", stroke: "#1b1714", "stroke-width": "2",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "150", cy: "108", rx: "26", ry: "18", fill: "#e7a57a", stroke: "#1b1714", "stroke-width": "3",
  }));
  svg.appendChild(shape("ellipse", {
    cx: "166", cy: "106", rx: "6", ry: "5", fill: "#1b1714",
  }));
  svg.appendChild(shape("circle", {
    cx: "98", cy: "96", r: "5.5", fill: "#1b1714", class: "eye",
  }));
  svg.appendChild(shape("circle", {
    cx: "120", cy: "94", r: "5.5", fill: "#1b1714", class: "eye",
  }));
  svg.appendChild(shape("circle", { cx: "100", cy: "94", r: "1.4", fill: "#fff6ea" }));
  svg.appendChild(shape("circle", { cx: "122", cy: "92", r: "1.4", fill: "#fff6ea" }));
  svg.appendChild(shape("path", {
    d: "M86 84 Q96 76 106 84", fill: "none", stroke: "#1b1714", "stroke-width": "2.5", "stroke-linecap": "round",
  }));
  svg.appendChild(shape("path", {
    d: "M112 80 Q122 70 134 82", fill: "none", stroke: "#1b1714", "stroke-width": "2.5", "stroke-linecap": "round",
  }));
  svg.appendChild(shape("path", {
    d: "M142 116 Q154 124 168 114", fill: "none", stroke: "#1b1714", "stroke-width": "2.5", "stroke-linecap": "round",
  }));
  svg.appendChild(shape("circle", { cx: "132", cy: "112", r: "5", fill: "#ff8b7a", opacity: "0.9" }));
  return svg;
}

function spikeAt(x, y, rotation, fill) {
  return shape("polygon", {
    points: "0,-26 9,7 -9,7",
    fill: fill,
    stroke: "#1b1714",
    "stroke-width": "2",
    "stroke-linejoin": "round",
    transform: "translate(" + x + " " + y + ") rotate(" + rotation + ")",
  });
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
