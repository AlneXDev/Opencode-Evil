import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Configuration } from "electron-builder"
import base from "./electron-builder.config"

const packageDir = path.dirname(fileURLToPath(import.meta.url))

// Side-by-side "OpenCode Eʌil" packaging. Reuses the build recipe from the
// main config but pins every OS-visible identity so it can coexist with a
// normal OpenCode install. The main config also has an explicit "evil" channel;
// these overrides make this config correct even when OPENCODE_CHANNEL is unset.
const config = base as Configuration
const appId = "ai.opencode.evil.desktop"

export default {
  ...config,
  appId,
  productName: "OpenCode Eʌil",
  artifactName: "opencode-evil-desktop-${os}-${arch}.${ext}",
  directories: { ...config.directories, output: "dist-evil" },
  extraMetadata: {
    ...config.extraMetadata,
    name: "@opencodevil-aidesktop",
    desktopName: `${appId}.desktop`,
  },
  // The renderer looks for icons under process.resourcesPath/icons at runtime.
  // Put the real evil icon set there on disk (the base config only packs resources
  // into app.asar and copies the CLI, so the window icon would otherwise be missing).
  extraResources: [
    ...(config.extraResources ?? []),
    { from: path.join(packageDir, "icons", "evil"), to: "icons" },
  ],
  protocols: { name: "OpenCode Eʌil", schemes: ["opencode-evil"] },
  publish: undefined,
  nsis: {
    ...config.nsis,
    guid: "fe09962c-9b87-4102-ba23-e87c8f8a562e",
    include: path.join(packageDir, "resources", "windows", "installer-evil.nsh"),
  },
  win: { ...config.win, icon: "resources/icons-evil/icon.ico" },
  mac: { ...config.mac, icon: "resources/icons-evil/icon.icns" },
  dmg: { icon: "resources/icons-evil/icon.icns" },
} satisfies Configuration
