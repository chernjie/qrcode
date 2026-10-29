'use strict';
const content = document.getElementById('content');
const correction = document.getElementById('correction');
const size = document.getElementById('size');
const preview = document.getElementById('qr');
const empty = document.getElementById('empty');
const error = document.getElementById('error');
const status = document.getElementById('status');
const png = document.getElementById('png');
const svg = document.getElementById('svg');
let currentQR = null;
let timer;
qrcode.stringToBytes = text => Array.from(new TextEncoder().encode(text));

function generate() {
  clearTimeout(timer);
  currentQR = null;
  png.disabled = svg.disabled = true;
  preview.replaceChildren();
  preview.hidden = true;
  empty.hidden = false;
  error.textContent = '';
  const text = content.value;
  const bytes = new TextEncoder().encode(text).length;
  document.getElementById('count').textContent = `${bytes.toLocaleString()} bytes`;
  status.textContent = 'Your QR code will appear here';
  if (!text.length) return;
  // QR byte capacity cannot exceed 2,953 bytes at the lowest correction level.
  if (bytes > 2953) {
    error.textContent = 'This text is too long for a QR code. Shorten it to 2,953 bytes or fewer.';
    status.textContent = 'Shorten your text to continue';
    return;
  }
  try {
    const qr = qrcode(0, correction.value);
    qr.addData(text, 'Byte');
    qr.make();
    // Build from the module matrix; user input is never inserted as HTML.
    preview.appendChild(new DOMParser().parseFromString(svgMarkup(qr), 'image/svg+xml').documentElement);
    currentQR = qr;
    preview.hidden = false;
    empty.hidden = true;
    png.disabled = svg.disabled = false;
    status.textContent = 'Ready to scan. Ready to share.';
  } catch (_) {
    error.textContent = 'This text exceeds the capacity at this correction level. Shorten it or choose a lower level.';
    status.textContent = 'Adjust your content to continue';
  }
}
function svgMarkup(qr) {
  const count = qr.getModuleCount();
  const width = count + 8;
  let path = '';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) path += `M${col + 4},${row + 4}h1v1h-1z`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${width}" width="${width * 16}" height="${width * 16}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path d="${path}" fill="black"/></svg>`;
}
function download(blob, filename) {
  if (!blob) { error.textContent = 'Download failed. Please try again.'; return; }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
content.addEventListener('input', () => {
  // Disable stale downloads immediately while waiting for typing to pause.
  png.disabled = svg.disabled = true;
  clearTimeout(timer);
  timer = setTimeout(generate, 180);
});
correction.addEventListener('change', generate);
document.getElementById('clear').addEventListener('click', () => {
  content.value = '';
  generate();
  content.focus();
});
svg.addEventListener('click', () => {
  if (currentQR) download(new Blob([svgMarkup(currentQR)], {type: 'image/svg+xml'}), 'qrcode.svg');
});
png.addEventListener('click', () => {
  if (!currentQR) return;
  const qr = currentQR;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Number(size.value);
  const ctx = canvas.getContext('2d');
  const count = qr.getModuleCount();
  const scale = Math.floor(canvas.width / (count + 8));
  const offset = Math.floor((canvas.width - count * scale) / 2);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) ctx.fillRect(offset + col * scale, offset + row * scale, scale, scale);
    }
  }
  canvas.toBlob(blob => download(blob, 'qrcode.png'), 'image/png');
});
generate();
