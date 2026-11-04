export function parseCliVersion(output: string) {
  const marker = output.lastIndexOf(" v")
  const version = marker === -1 ? output : output.slice(marker + 2)

  if (!version) throw new Error("V2 CLI did not provide a version")

  return version
}

import path from "node:path"

export function serviceVersion(input: {
  readonly channel: "local" | "dev" | "beta" | "evil" | "prod"
  readonly isolated?: boolean
  readonly mode: "initial" | "reconnect"
  readonly version: string
}) {
  if (input.mode === "reconnect") return undefined

  if (input.channel === "beta" && !input.isolated) return releasedBuild(input.version)

  return input.version
}

/** Whether a server version comes from a released channel (stable, beta, next) rather than a dev build. */
export function releasedBuild(version: string) {
  return !version.startsWith("0.0.0-dev-")
}

/**
 * The registration file the CLI writes, or undefined for the shared `service.json` of the released channels. Follows
 * the CLI itself rather than the app's channel, because a source build can run any CLI: a dev build writes
 * `service-dev.json`, a released one `service.json`. Matches the CLI's `ServiceConfig.filename`.
 */
export function serviceFile(input: {
  /** The CLI's version. */
  readonly version: string
  /** `OPENCODE_DESKTOP_SERVER_CHANNEL`: `local` for a CLI built from this checkout. */
  readonly server?: string
  readonly stateHome: string
}) {
  if (input.server === "local") return path.join(input.stateHome, "opencode", "service-local.json")

  if (input.server === "evil") return path.join(input.stateHome, "opencode", "service-evil.json")

  if (input.server === "dev") return path.join(input.stateHome, "opencode", "service-dev.json")

  if (!releasedBuild(input.version)) return path.join(input.stateHome, "opencode", "service-dev.json")

  return undefined
}

// Retrying on timeout can also replace a server stuck in a migration longer than 120 s, which is accepted.
export function shouldRetryEnsure(pinned: boolean, message: string) {
  if (pinned) return false

  return (
    message === "Background service failed to start" ||
    message === "Timed out waiting for the background service to start"
  )
}

export function stageName(version: string, arch = process.arch) {
  return `${version}-${arch}`.replace(/[^a-zA-Z0-9._-]/g, "-")
}

export function keptStages(bundledVersion: string, runningVersion?: string, arch = process.arch) {
  const stages = [stageName(bundledVersion, arch)]

  if (runningVersion && runningVersion !== bundledVersion) stages.push(stageName(runningVersion, arch))

  return stages
}
