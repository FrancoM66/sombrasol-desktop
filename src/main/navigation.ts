export function isAllowedNavigation(targetUrl: string, allowedOrigin: string): boolean {
  try {
    return new URL(targetUrl).origin === new URL(allowedOrigin).origin;
  } catch {
    return false;
  }
}
