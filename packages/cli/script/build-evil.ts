#!/usr/bin/env bun
// evil-v2: build the Windows CLI with the evil service channel so it uses its
// own service.json name and port instead of colliding with normal OpenCode.
process.env.OPENCODE_CHANNEL = "evil"
process.env.OPENCODE_TARGET = "windows-x64-baseline"
// evil-v2: preview builds default to 0.0.0-evil-<timestamp>, which the free-tier
// server rejects (requires >= 1.18.0). Embed the real package version instead.
process.env.OPENCODE_VERSION ??= (await Bun.file(new URL("../../../package.json", import.meta.url)).json()).version

await import("./build")
