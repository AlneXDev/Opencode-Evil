import { readFileSync } from "node:fs"
import path from "node:path"
import { app } from "electron"
import type { Endpoint } from "@opencode/client/service"
import { CHANNEL } from "../constants"

// The main thread idles between showing the first window and evaluating the main bundle, waiting
// for the renderer's asset requests. That slot is long enough to find out whether a compatible
// background service is already running, so the renderer's first data request is not the first
// moment anyone asks. The probe only looks; a service that has to be started waits for the layers,
// which set the environment the CLI expects.
let probe: Promise<Endpoint | undefined> | undefined

// evil-v2: probe only the evil registration file so it never adopts normal OpenCode's service.
const IS_EVIL_CHANNEL = CHANNEL === "evil"

function probeFile(): string | undefined {
  if (IS_EVIL_CHANNEL) return "service-evil.json"
  if (process.env.OPENCODE_DESKTOP_SERVER_CHANNEL === "local") return "service-local.json"
  return undefined
}

export function startSidecarProbe() {
  if (!app.isPackaged) return
  const version = CHANNEL === "beta" ? undefined : bundledVersion()

  if (version === "") return
  const file = probeFile()
  const options = file
    ? {
        version,
        file: path.join(
          process.env.XDG_STATE_HOME ?? path.join(app.getPath("home"), ".local", "state"),
          "opencodevil",
          file,
        ),
      }
    : { version }
  probe = import("@opencode/client/service")
    .then(({ Service }) => Service.discover(options))
    .catch(() => undefined)
}

/** The probe's result, once: a later connect must not adopt a service that may have exited since boot. */
export function takeSidecarProbe() {
  const result = probe ?? Promise.resolve(undefined)
  probe = undefined

  return result
}

function bundledVersion() {
  try {
    return readFileSync(path.join(process.resourcesPath, "opencodevil-cli.version"), "utf8").trim()
  } catch {
    return ""
  }
}
