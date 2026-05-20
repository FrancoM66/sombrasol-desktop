# Sombrasol Guard Desktop

Windows kiosk shell that loads the Sombrasol web app full-screen for gatehouse guards.
Fails gracefully offline and auto-updates. See
`docs/superpowers/specs/2026-05-20-guard-desktop-electron-design.md` (in the API repo)
for the design.

## Develop
```bash
npm install
npm run dev        # launches the shell against production
npm test           # unit tests (pure logic)
npm run typecheck
```

Override the target site for staging:
```bash
SOMBRASOL_APP_URL=https://staging.sombrasol.tech npm run dev
```

## Build the Windows installer
```bash
npm run build:win  # outputs dist/Sombrasol Guard-Setup-<version>.exe
```

> **Windows note:** electron-builder extracts a signing toolchain that contains
> symlinks. If the build fails with `Cannot create symbolic link : A required
> privilege is not held by the client`, enable **Developer Mode** (Settings →
> Privacy & security → For developers) or run the build from an elevated terminal.

## Releasing updates
1. Bump `version` in `package.json`.
2. `npm run build:win`.
3. Upload the contents of `dist/` (installer + `latest.yml` + blockmap) to the update
   host configured in `electron-builder.yml` (`publish.url`).
4. Installed apps pick up the update on next launch.

## Not in v1
Local DB / offline data, social login, macOS/Linux, printing, code signing.
