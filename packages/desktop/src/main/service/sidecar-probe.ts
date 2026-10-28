import { readFileSync } from "node:fs"
import path from "node:path"
import { app } from "electron"
import type { DiscoverOptions, Endpoint } from "@opencode/client/service"
import { APP_NAME } from "../constants"

// Whether this build is the evil channel: it owns its own service registration and port so it can
// run side by side with normal OpenCode without colliding on the shared service.json / listening port.
const IS_EVIL_CHANNEL = APP_NAME === "OpenCode Evil"

// The main thread idles between showing the first window and evaluating the main bundle, waiting
// for the renderer's asset requests. That slot is long enough to find out whether a compatible
// background service is already running, so the renderer's first data request is not the first
// moment anyone asks. The probe only looks; a service that has to be started waits for the layers,
// which set the environment the CLI expects.
let probe: Promise<Endpoint | undefined> | undefined

// Which registration file a channel discovers/owns. Each channel must only probe its own
// registration file so the evil build never adopts (or migrates) normal OpenCode's shared service.
function probeFile(): string | undefined {
  if (IS_EVIL_CHANNEL) return "service-evil.json"
  if (process.env.OPENCODE_DESKTOP_SERVER_CHANNEL === "local") return "service-local.json"
  return undefined
}

export function startSidecarProbe() {
  if (!app.isPackaged) return
  const version = bundledVersion()

  if (!version) return
  const options: DiscoverOptions = { version }
  const file = probeFile()
  if (file !== undefined)
    options.file = path.join(
      process.env.XDG_STATE_HOME ?? path.join(app.getPath("home"), ".local", "state"),
      "opencode",
      file,
    )
  probe = import("@opencode/client/service")
    .then(({ Service }) => Service.discover(options))
    .catch(() => undefined)
}

export function sidecarProbe() {
  return probe ?? Promise.resolve(undefined)
}

function bundledVersion() {
  try {
    return readFileSync(path.join(process.resourcesPath, "opencode-cli.version"), "utf8").trim()
  } catch {
    return ""
  }
}
