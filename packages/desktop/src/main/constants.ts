import { app } from "electron"
import { protocolScheme, resolveChannel, resolveIdentity, type Channel } from "./identity"

export const CHANNEL: Channel = resolveChannel(import.meta.env.OPENCODE_CHANNEL)

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

const identity = resolveIdentity(CHANNEL, app.isPackaged)

export const APP_NAME = identity.appName

export const APP_ID = identity.appID

export const APP_USER_MODEL_ID = identity.appUserModelID

// URL protocol scheme derived from the app id:
// ai.opencode.evil.desktop -> opencode-evil, ai.opencode.desktop -> opencode
export const PROTOCOL_SCHEME = protocolScheme(APP_ID)
