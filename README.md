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

## Attribution

Bundles [qrcode-generator 2.0.4](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase under the MIT license. Upstream attribution is retained in `docs/vendor/qrcode.js` and `docs/vendor/README.md`.
