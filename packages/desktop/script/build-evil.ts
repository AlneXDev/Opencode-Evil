// evil-v2: build the renderer/main bundles with the side-by-side evil identity
// and the distinct evil icon set, then defer to the normal build pipeline.
process.env.OPENCODE_CHANNEL = "evil"
process.env.OPENCODE_EVIL = "1"
// evil-v2: keep the embedded version at or above the free-tier minimum.
process.env.OPENCODE_VERSION ??= (await Bun.file(new URL("../../../package.json", import.meta.url)).json()).version
// The Windows desktop build always uses the native x64 CLI target.
delete process.env.OPENCODE_TARGET

await import("./build")
