import { protocolScheme, resolveChannel, resolveIdentity } from "../identity"

export function consoleReturnWindow(value: string) {
  const scheme = protocolScheme(
    resolveIdentity(resolveChannel(), typeof process === "undefined" || !process.defaultApp).appID,
  )
  try {
    const url = new URL(value)

    if (url.protocol !== `${scheme}:` || url.hostname !== "console" || url.pathname !== "/authorized") return
    const id = url.searchParams.get("window")

    if (!id || id.length > 256 || /[\u0000-\u001f\u007f]/.test(id)) return

    return id
  } catch {
    return
  }
}
