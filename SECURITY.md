# Security

Scrollhog is a local Chrome extension. It watches how long LinkedIn stays open and draws a nudge on that page. It does not talk to a server, and it does not read your feed, messages, or account.

## Permissions

| Permission | Why it is here |
| --- | --- |
| Host access to `https://linkedin.com` and `https://*.linkedin.com` | Inject the nudge, and find LinkedIn tabs so Close can shut all of them. |
| `storage` | Keep the session clock in `chrome.storage.session` so a service-worker restart does not forget it. Nothing is written outside the browser profile. |
| `alarms` | Wake the service worker on a short interval so time still counts when a LinkedIn tab is in the background and its timers are throttled. |

The broad `tabs` permission is intentionally not requested. Host access is enough to see and close LinkedIn tabs, and it does not reveal the URLs of other sites.

## What the extension refuses to do

- No remote code, no CDN scripts, no runtime font or image requests.
- No analytics and no network calls of any kind.
- No `eval`, `new Function`, `innerHTML`, `outerHTML`, or `document.write`.
- Page copy is inserted with `textContent`. Messages from the page are never treated as HTML.
- The overlay lives in a closed shadow tree, with host layout pinned using inline `!important` styles, so the site cannot restyle or reach the buttons.
- Extension pages set a strict content security policy: `script-src 'self'; object-src 'self'; base-uri 'none'; frame-ancestors 'none'`.
- Close only removes tabs whose URLs match LinkedIn. The button does not accept a tab id from the page.

## Reporting a problem

Open a GitHub issue and describe what you observed. Do not include tokens, cookies, or personal data.
