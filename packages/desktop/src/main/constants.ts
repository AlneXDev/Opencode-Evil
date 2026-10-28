import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "evil" | "prod"

const raw = import.meta.env.OPENCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "evil" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "OpenCode Dev",
  beta: "OpenCode Beta",
  prod: "OpenCode",
  evil: "OpenCode Evil",
}

const appIDs: Record<string, string> = {
  dev: "ai.opencode.desktop.dev",
  beta: "ai.opencode.desktop.beta",
  prod: "ai.opencode.desktop",
  evil: "ai.opencode.desktop.evil",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "OpenCode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.opencode.desktop.dev"

// URL protocol scheme derived from the app id:
// ai.opencode.desktop.evil -> opencode-evil, ai.opencode.desktop -> opencode
export const PROTOCOL_SCHEME = APP_ID.replace(/^ai\.opencode\.desktop(?:\.(\w+))?$/, (_: string, suffix: string | undefined) =>
  suffix ? `opencode-${suffix}` : "opencode",
)
