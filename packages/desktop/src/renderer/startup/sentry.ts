import pkg from "../../../package.json"

export function desktopVersion() {
  return import.meta.env.OPENCODE_VERSION ?? pkg.version
}

// evil-v2: Sentry telemetry disabled at build time.
export async function initializeSentry(_version: string) {}
