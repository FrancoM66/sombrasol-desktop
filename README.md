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
npm run build:win  # outputs dist/Sombrasol-Guard-Setup.exe
```

> **Windows note:** electron-builder extracts a signing toolchain that contains
> symlinks. If the build fails with `Cannot create symbolic link : A required
> privilege is not held by the client`, enable **Developer Mode** (Settings →
> Privacy & security → For developers) or run the build from an elevated terminal.

## Releasing a downloadable installer

The web app links to the newest installer at a stable GitHub Releases URL:
`https://github.com/FrancoM66/sombrasol-desktop/releases/latest/download/Sombrasol-Guard-Setup.exe`

To publish a new version:
1. Bump `version` in `package.json`.
2. `npm run build:win` → produces `dist/Sombrasol-Guard-Setup.exe`.
3. Create a GitHub release and attach the installer:
   ```bash
   gh release create vX.Y.Z "dist/Sombrasol-Guard-Setup.exe" \
     --title "Sombrasol Guard vX.Y.Z" --notes "<release notes>"
   ```
   Because the asset name is constant, the `releases/latest/download/...` link always
   resolves to this newest upload.

(Silent auto-update is configured separately via `electron-builder.yml`'s `publish:`
block and is independent of this download link.)

## Not in v1
Local DB / offline data, social login, macOS/Linux, printing, code signing.
