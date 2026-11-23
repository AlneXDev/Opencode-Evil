#!/usr/bin/env bun
// evil-v2: build the Windows CLI with the evil service channel so it uses its
// own service.json name and port instead of colliding with normal OpenCode.
process.env.OPENCODE_CHANNEL = "evil"
process.env.OPENCODE_TARGET = "windows-x64-baseline"

await import("./build")
