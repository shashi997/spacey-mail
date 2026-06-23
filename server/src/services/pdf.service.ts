import puppeteer from 'puppeteer';
import type { LetterDocument } from '../types/letter.types.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtmlTemplate(letter: LetterDocument): string {
  const r = letter.recipient;
  const s = letter.sender;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 20mm 22mm 20mm 22mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      font-size: 12pt;
      margin: 0;
      padding: 0;
    }
    .sender-block { margin-bottom: 40px; }
    .sender-block .name { font-size: 14pt; font-weight: 700; }
    .sender-block .email { font-size: 10pt; color: #666; }
    .recipient-block { margin-bottom: 40px; }
    .recipient-block .label { font-size: 10pt; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .recipient-block .rname { font-weight: 600; }
    .recipient-block .addr { color: #555; }
    .entry-content { margin-top: 10px; }
    .entry-content p { margin: 0 0 10px 0; }
    .ql-align-center { text-align: center; }
    .ql-align-right { text-align: right; }
    .ql-align-justify { text-align: justify; }
    blockquote { border-left: 4px solid #ccc; margin: 5px 0; padding-left: 16px; color: #555; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    img { max-width: 100%; height: auto; }
    ul, ol { padding-left: 24px; }
  </style>
</head>
<body>
  <div class="sender-block">
    <div class="name">${escapeHtml(s.name || 'Sender')}</div>
    <div class="email">${escapeHtml(s.email || '')}</div>
  </div>
  <div class="recipient-block">
    <div class="label">To</div>
    <div class="rname">${escapeHtml(r.name || 'Recipient')}</div>
    <div class="addr">${escapeHtml(r.addressLine1 || '')}${r.addressLine2 ? `, ${escapeHtml(r.addressLine2)}` : ''}<br>
    ${escapeHtml(r.city || '')}${r.state ? `, ${escapeHtml(r.state)}` : ''} ${escapeHtml(r.zipCode || '')}</div>
    ${r.facilityName ? `<div class="addr">Facility: ${escapeHtml(r.facilityName)}</div>` : ''}
    ${r.inmateId ? `<div class="addr">Inmate ID: ${escapeHtml(r.inmateId)}</div>` : ''}
  </div>
  <div class="entry-content">
    ${letter.body || ''}
  </div>
</body>
</html>`;
}

export async function generateLetterPdf(letter: LetterDocument): Promise<Buffer> {
  const html = buildHtmlTemplate(letter);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
