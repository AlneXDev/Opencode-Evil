// evil-opencode: telemetry disabled at build time
type Integration = { name: string }
type InitOptions = {
  integrations?: (integrations: Integration[]) => Integration[]
  [key: string]: unknown
}

export const isEnabled = () => false
export function init(_options?: InitOptions) {}
export function captureException(_error: unknown) {
  return undefined
}
