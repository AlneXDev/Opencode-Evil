// evil-v2: package the Windows installer with the evil identity and config.
import { $ } from "bun"
import path from "node:path"

process.env.OPENCODE_CHANNEL = "evil"
process.env.OPENCODE_EVIL = "1"
// The Windows desktop build always uses the native x64 CLI target.
delete process.env.OPENCODE_TARGET

const dir = path.resolve(import.meta.dir, "..")
process.chdir(dir)

await $`bunx electron-builder --win --x64 --dir --publish never --config electron-builder.evil.config.ts`
