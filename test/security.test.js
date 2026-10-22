"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.join(__dirname, "..");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const TEXT = walk(ROOT).filter((file) => /\.(js|json|md|html)$/.test(file));
const CODE = TEXT.filter((file) => {
  const rel = path.relative(ROOT, file);
  return /^(src|demo)\//.test(rel) || rel === "manifest.json";
});

test("extension code does not fetch, eval, or inject HTML", () => {
  const banned = [
    /innerHTML/,
    /outerHTML/,
    /insertAdjacentHTML/,
    /document\.write/,
    /\beval\s*\(/,
    /new\s+Function/,
    /\bfetch\s*\(/,
    /XMLHttpRequest/,
    /WebSocket/,
    /sendBeacon/,
    /importScripts\s*\(\s*["']https?:/,
    /url\(\s*["']?https?:/,
  ];
  for (const file of CODE) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of banned) {
      assert.equal(pattern.test(text), false, `${path.relative(ROOT, file)} matches ${pattern}`);
    }
  }
});

test("manifest is local, strict, and limited to LinkedIn", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions.sort(), ["alarms", "storage"]);
  assert.deepEqual(manifest.host_permissions, [
    "https://*.linkedin.com/*",
    "https://linkedin.com/*",
  ]);
  assert.equal(manifest.background.service_worker, "src/background.js");
  assert.equal(manifest.background.type, undefined);
  const csp = manifest.content_security_policy.extension_pages;
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /object-src 'self'/);
  assert.doesNotMatch(csp, /unsafe-eval|unsafe-inline|http:|https:/);
  assert.equal(JSON.stringify(manifest).includes("http://"), false);
  const script = manifest.content_scripts[0];
  assert.equal(script.world, "ISOLATED");
  assert.equal(script.all_frames, false);
  assert.deepEqual(script.matches, manifest.host_permissions);
});

test("the repo does not carry an email address or a secret-looking assignment", () => {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const secret = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']+["']/i;
  for (const file of TEXT) {
    const text = fs.readFileSync(file, "utf8");
    assert.equal(email.test(text), false, path.relative(ROOT, file));
    assert.equal(secret.test(text), false, path.relative(ROOT, file));
  }
});
