import { app } from "electron"
import { existsSync } from "node:fs"
import { join } from "node:path"

type Channel = "dev" | "beta" | "prod"
const raw = import.meta.env.OPENCODE_CHANNEL
export const CHANNEL: Channel = raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

// Packaging without a publish feed produces no app-update.yml; offering updates then
// only yields a failing check dialog, so treat the updater as unavailable.
export const UPDATER_ENABLED =
  app.isPackaged && CHANNEL !== "dev" && existsSync(join(process.resourcesPath, "app-update.yml"))
