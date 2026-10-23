# OpenCode Evil (fork of anomalyco/opencode v1.19.4)

This is a Windows-focused Electron fork with guardrails removed, Zen legacy /zen/v1 behavior restored, all 130 Zen models kept, and a generic anti-refusal directive added at prompt and request level.

## Key changes
- Side-by-side identity (appId/productName/install dir/DB) so the stock app is untouched.
- 130 Zen models rewritten to https://opencode.ai/zen/v1; opencode-go left on /inference/go/*.
- Hard/soft refusal text removed from prompts; generic compliance block prepended in session/system.ts and session/llm/request.ts.
- Desktop packaging config packages/desktop/electron-builder.evil-standalone.config.ts for standalone evil build.
- Models-dev runtime pinZen override and header cleanup in core/opencode.

## Build (Windows)
See X:\AI Projects\OpenCode\installer-backups\20261023-1311-zenlegacy-r4\NOTES.md for the exact commands and hashes used for r4.

patch-evil.ts reapplies prompt edits and can be re-run; evil/models-dev-zenlegacy-130.json is the catalog snapshot used for r4.
