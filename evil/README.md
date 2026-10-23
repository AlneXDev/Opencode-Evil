# OpenCode Evil

Fork of [anomalyco/opencode](https://github.com/anomalyco/opencode) at **v1.19.4**, packaged for side-by-side use with the stock app.

## What is different

| Area | Stock | This fork |
| --- | --- | --- |
| Prompt guardrails | hard/soft refusal text present | stripped from all 15 prompt files, plus a generic anti-refusal block prepended at request time |
| Zen models | current catalog | all **130** models kept |
| Zen URLs | `/inference/...` | `https://opencode.ai/zen/v1` (legacy); `opencode-go` stays on `/inference/go/*` |
| appId | `ai.opencode.desktop` | `ai.opencode.desktop.evil` |
| productName | `OpenCode` | `OpenCode Evil` |
| install directory | `@opencode-aidesktop` | `opencode-evil` |
| database | shared stock DB | own DB (`%APPDATA%\ai.opencode.desktop.evil\opencode.db`) |
| auto-update | enabled | disabled (`publish: null`, no `app-update.yml`) |
| session headers | `x-opencode-session-id`, `x-opencode-parent-session-id` | removed; legacy `x-opencode-session` retained |

Functional constraints are intentionally kept: plan mode stays read-only, the `explore` agent stays read-only, permission prompts remain, kimi's working-directory caution remains, and the secret-hygiene line remains.

## Layout

- `evil/patch-evil.ts` — reapplies the prompt edits (guardrail removal + compliance block). Run from the repo root:
  `bun evil/patch-evil.ts .`
- `evil/models-dev-zenlegacy-130.json` — the 130-model catalog snapshot used for the build.
- `packages/desktop/electron-builder.evil-standalone.config.ts` — side-by-side packaging (identity, output dir `dist-evil`, no publish, unsigned).
- `packages/opencode/src/session/system.ts` — exports `compliance`.
- `packages/opencode/src/session/llm/request.ts` — prepends `SystemPrompt.compliance` to the system message.
- `packages/core/src/models-dev.ts` — runtime `pinZen` override (keeps `zen/v1` even if the disk cache is stale).
- `.github/workflows/release-evil.yml` — builds Windows/Linux/macOS and publishes one release.

## Build locally (Windows example)

```powershell
$env:OPENCODE_VERSION = "1.19.4"
$env:OPENCODE_CHANNEL = "prod"
$env:MODELS_DEV_API_JSON = "$PWD/evil/models-dev-zenlegacy-130.json"

bun install --frozen-lockfile
Set-Location packages/desktop
bun run build
bunx electron-builder --win --config electron-builder.evil-standalone.config.ts
```

Outputs in `packages/desktop/dist-evil/`. Linux uses `--linux`, macOS uses `--mac`; the GitHub workflow does all three.

## Releases

GitHub Actions → **Build and Release OpenCode Evil (All Platforms)** → *Run workflow*, or push a tag like `v1.19.4-evil-r4`.

## Notes

- Builds are unsigned. Windows SmartScreen and macOS Gatekeeper will warn.
- The compliance directive is generic; it does not enumerate illegal categories.
- Model alignment can still override prompt instructions. If a model refuses, switch models — the build cannot force a model's own policy.
