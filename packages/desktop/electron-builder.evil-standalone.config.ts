// Side-by-side packaging for the unguarded fork.
//
// The upstream config uses appId "ai.opencode.desktop" and productName "OpenCode",
// so installing it would replace a stock OpenCode install and share its user data
// directory (%APPDATA%\ai.opencode.desktop). This variant ships as a separate app:
// own app id, own install directory (%LOCALAPPDATA%\Programs\opencode-evil), own
// user data directory, no shared protocol handler, and no auto-update feed.
import upstreamConfig from "./electron-builder.config"

const base = upstreamConfig as Record<string, any>

export default {
  ...base,
  appId: "ai.opencode.desktop.evil",
  productName: "OpenCode Evil",
  executableName: "opencode-evil",
  artifactName: "opencode-evil-desktop-${os}-${arch}.${ext}",
  directories: {
    ...(base.directories ?? {}),
    output: "dist-evil",
  },
  // Never take over opencode:// from the stock app; opt in with OPENCODE_EVIL_PROTOCOL=1.
  protocols: [],
  // No update feed: the fork must not silently pull a stock release over itself.
  publish: null,
  mac: {
    ...(base.mac ?? {}),
    identity: null,
    hardenedRuntime: false,
    notarize: false,
  },
  dmg: {
    ...(base.dmg ?? {}),
    sign: false,
  },
  win: {
    ...(base.win ?? {}),
    // Unsigned: local build, no certificate available.
    signtoolOptions: {
      sign: async () => undefined,
    },
  },
  nsis: {
    ...(base.nsis ?? {}),
    // One-click installs derive their folder from the package name ("@opencode-aidesktop"),
    // which would overwrite a stock install. The assisted installer requires a confirmation
    // page, so electron-builder uses the product filename ("opencode-evil") instead.
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    shortcutName: "OpenCode Evil",
    // Do not launch the app at the end of installation.
    runAfterFinish: false,
    deleteAppDataOnUninstall: false,
  },
}
