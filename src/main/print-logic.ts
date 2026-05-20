export function htmlToDataUrl(html: string): string {
  const base64 = Buffer.from(html, 'utf-8').toString('base64');
  return `data:text/html;base64,${base64}`;
}
