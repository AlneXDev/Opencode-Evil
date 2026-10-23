import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Configuration } from "electron-builder"
import { getConfig } from "./electron-builder.config"

const packageDir = path.dirname(fileURLToPath(import.meta.url))

const APP_ID = "ai.opencode.desktop.evil"
const PRODUCT_NAME = "OpenCode Evil"

const metainfoFpm = `${path.join(packageDir, "resources", "evil", `${APP_ID}.metainfo.xml`)}=/usr/share/metainfo/${APP_ID}.metainfo.xml`

// fpm only accepts flags before the first src=dest mapping.
const rpmNoBuildIdLinksFpm = "--rpm-rpmbuild-define=_build_id_links none"

// Side-by-side OpenCode Evil packaging. The stock electron-builder config owns
// every build detail (CLI verification, node-pty checks, asar filters); this
// variant only changes identity, isolation and release wiring.
const base = getConfig()

export default {
  ...base,
  appId: APP_ID,
  productName: PRODUCT_NAME,
  artifactName: "opencode-evil-desktop-${os}-${arch}.${ext}",
  directories: { ...base.directories, output: "dist-evil" },
  extraMetadata: { desktopName: `${APP_ID}.desktop` },
  // Never claim the stock opencode:// handler as part of an install.
  protocols: [],
  // No upstream update feed: an Evil build must never replace itself with stock
  // OpenCode. The updater is also opt-in at runtime.
  publish: null,
  deb: {
    packageName: "opencode-evil",
    fpm: [metainfoFpm],
  },
  rpm: {
    packageName: "opencode-evil",
    fpm: [rpmNoBuildIdLinksFpm, metainfoFpm],
  },
  mac: {
    ...base.mac,
    identity: null,
    hardenedRuntime: false,
    notarize: false,
    sign: undefined,
    entitlements: undefined,
    entitlementsInherit: undefined,
  },
  dmg: {
    sign: false,
  },
  win: {
    ...base.win,
    signtoolOptions: undefined,
    verifyUpdateCodeSignature: false,
  },
  nsis: {
    ...base.nsis,
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: PRODUCT_NAME,
    deleteAppDataOnUninstall: false,
  },
  linux: {
    ...base.linux,
    executableName: "opencode-evil",
    syncDesktopName: true,
    desktop: {
      entry: {
        StartupWMClass: APP_ID,
      },
    },
  },
} satisfies Configuration
