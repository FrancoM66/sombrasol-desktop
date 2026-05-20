# Smoke Checklist — Sombrasol Guard Desktop

Run on a Windows machine after `npm run build:win`.

## Install & launch
- [ ] Run `dist/Sombrasol Guard-Setup-<version>.exe`. SmartScreen "unknown publisher"
      warning is expected (unsigned) — choose "Run anyway".
- [ ] App launches full-screen with no address bar or tabs.

## Auth & scanning
- [ ] Log in with email/password. Session persists after closing and reopening the app.
- [ ] Open the gatehouse check-in screen and scan a barcode with the USB scanner;
      the code lands in the scan field exactly as in the browser.

## Printing (desktop silent print)
- [ ] With a default printer set, open a visitor pass and click **Print Pass**.
      The pass prints to the default printer with **no dialog**, and a
      "Pass sent to printer" toast appears.
- [ ] The printed pass shows the org name, visitor name, license plate, address,
      and time, laid out like the browser pass.
- [ ] Remove/disable the default printer and click **Print Pass** again.
      The Windows system print dialog appears as a fallback (guard is not stranded).

## Lockdown
- [ ] External links open in the system browser, not in the app window.
- [ ] DevTools shortcuts (F12, Ctrl+Shift+I) do nothing.
- [ ] `Ctrl+Shift+Q` quits the app.

## Offline resilience
- [ ] Disable the network. Within a few seconds the offline page appears.
- [ ] Re-enable the network. The app auto-reloads the site within ~30s.
- [ ] No white screen or crash at any point.

## Auto-update
- [ ] Publish a higher version to the update feed.
- [ ] Relaunch the installed app; confirm it downloads the update and applies it on next quit.
