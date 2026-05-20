import { describe, it, expect } from 'vitest';
import { isAllowedNavigation } from './navigation';

describe('isAllowedNavigation', () => {
  const origin = 'https://www.sombrasol.tech';

  it('allows same-origin urls', () => {
    expect(isAllowedNavigation('https://www.sombrasol.tech/communities/1/check-in', origin)).toBe(true);
  });

  it('rejects a different host', () => {
    expect(isAllowedNavigation('https://evil.example.com/login', origin)).toBe(false);
  });

  it('rejects a different scheme on the same host', () => {
    expect(isAllowedNavigation('http://www.sombrasol.tech/', origin)).toBe(false);
  });

  it('rejects malformed urls', () => {
    expect(isAllowedNavigation('not a url', origin)).toBe(false);
  });
});
