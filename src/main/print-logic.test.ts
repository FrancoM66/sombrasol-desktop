import { describe, it, expect } from 'vitest';
import { htmlToDataUrl } from './print-logic';

describe('htmlToDataUrl', () => {
  it('prefixes a base64-encoded text/html data url', () => {
    const html = '<p>hi</p>';
    expect(htmlToDataUrl(html)).toBe(
      'data:text/html;base64,' + Buffer.from(html, 'utf-8').toString('base64'),
    );
  });

  it('round-trips utf-8 content', () => {
    const html = '<p>Niño — café ☕</p>';
    const url = htmlToDataUrl(html);
    const base64 = url.replace('data:text/html;base64,', '');
    expect(Buffer.from(base64, 'base64').toString('utf-8')).toBe(html);
  });
});
