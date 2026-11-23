import { $ } from "bun"
import { resolveChannel } from "./utils"

const arg = process.argv[2]

const channel = arg === "dev" || arg === "beta" || arg === "evil" || arg === "prod" ? arg : resolveChannel()

// EVIL PATCH: use the distinct evil icon set for side-by-side builds.
const src = process.env.OPENCODE_EVIL === "1" ? "./icons/evil" : `./icons/${channel}`

const dest = "resources/icons"

await $`rm -rf ${dest}`

await $`cp -R ${src} ${dest}`

console.log(`Copied ${channel} icons from ${src} to ${dest}`)
