# QR Studio

A static, responsive QR code generator for GitHub Pages. Enter any string or URL to generate a code locally, then download a PNG or SVG. Supports Unicode, four error correction levels, and 512/1024/2048 px PNG exports. No build step, account, analytics, or external runtime requests.

## Preview

Open `docs/index.html` in a modern browser, or serve `docs/` with any static web server.

## Publish on GitHub Pages

1. Push this project to your GitHub repository.
2. In the repository's **Settings → Pages**, select **Deploy from a branch**.
3. Select your branch and **/docs**, then click **Save**.
4. GitHub Pages will show the published site URL, typically `https://USERNAME.github.io/REPOSITORY/`.

The complete site lives in `docs/`. No custom Actions workflow is needed.

Text is encoded exactly as entered, including spaces and newlines, using UTF-8. Empty text clears the preview. QR capacity depends on the chosen error correction level; oversized input shows an error and disables downloads. Downloads use black modules, a white background, and a quiet zone of at least four modules.

## Generate from a URL

Pass a URL-encoded string in the `text` query parameter to fill the input and generate a QR code on load:

```text
https://USERNAME.github.io/REPOSITORY/?text=Hello%20world
https://USERNAME.github.io/REPOSITORY/?text=https%3A%2F%2Fexample.com%2F%3Fa%3D1%26b%3D2
```

Build links with `URLSearchParams` to preserve special characters, Unicode, spaces, and newlines:

```js
const url = new URL('https://USERNAME.github.io/REPOSITORY/');
url.searchParams.set('text', 'Hello 🌍 + & #');
console.log(url.href);
```

Without `text`, the input starts empty. `?text=` also leaves it empty. If repeated, the first `text` value is used. A raw `+` in a query is decoded as a space; encode a literal plus as `%2B`. The same QR capacity limits apply to URL input. Browser and hosting URL length limits may restrict long links further.

### Security and privacy

- Query strings are sent to the hosting service on the initial request and may appear in hosting logs, browser history, copied links, and link preview services. Do not use query parameters for passwords, tokens, or other secrets. Manually typed content is processed locally and is not added to the URL.
- A `no-referrer` policy prevents this page from sending its URL as a referrer on subsequent requests. It cannot hide the original query from the host or remove existing copies.
- Input is assigned through the textarea's `value`, never interpreted as HTML or JavaScript. QR SVGs are built only from numeric module coordinates. A string such as `<script>…</script>` remains plain text.
- The page encodes text without visiting or executing it. A QR code can still contain a phishing URL or dangerous scanner action; review the visible text and the scanner's destination before opening it. QR codes are not encrypted.
- Oversized input is rejected before QR generation. The encoder is bundled locally, so there is no runtime CDN dependency. As with any website, a compromised deployment or dependency could change its behavior.

## Attribution

Bundles [qrcode-generator 2.0.4](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase under the MIT license. Upstream attribution is retained in `docs/vendor/qrcode.js` and `docs/vendor/README.md`.
