import pkg from "../../../package.json"

export function desktopVersion() {
  return import.meta.env.OPENCODE_VERSION ?? pkg.version
}

export async function initializeSentry(_version: string) {
  // OpenCode Evil never sends crash reports or telemetry.
  return
}
