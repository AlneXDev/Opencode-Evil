import { useWorkspaceLocation } from "@/workspaces/location"
import { Persist, persisted } from "@/runtime/persistence/storage"
import { onCleanup } from "solid-js"
import { Schema } from "effect"
import { Persistence } from "@/runtime/persistence/schema"
import { useSessionLayout } from "./session-layout"
import { useDialog } from "@opencode/ui/context"
import type { ModelSelection } from "@/providers/models/selection"

const GO_UPSELL_FREE_TIER_LAST_SEEN_AT = "go_upsell_last_seen_at"

const GO_UPSELL_FREE_TIER_DONT_SHOW = "go_upsell_dont_show"

const GO_UPSELL_WINDOW = 86_400_000 // 24 hrs

const MAX_RETRY_AFTER_MS = 45 * 86_400_000

const CHATGPT_USAGE_LIMIT_WINDOW = 86_400_000 // 24 hrs

// When a usage limit resets, or undefined when the refusal's delay is missing or out of range.
export function limitResetAt(created: number, retryAfterMs: number | undefined) {
  if (
    retryAfterMs === undefined ||
    !Number.isFinite(retryAfterMs) ||
    retryAfterMs < 0 ||
    retryAfterMs > MAX_RETRY_AFTER_MS ||
    !Number.isFinite(created)
  )
    return undefined

  const at = created + retryAfterMs

  if (Number.isNaN(new Date(at).getTime())) return undefined

  return at
}

export function formatLimitReset(locale: string, created: number, retryAfterMs: number | undefined) {
  const at = limitResetAt(created, retryAfterMs)

  if (at === undefined) return undefined

  const now = Date.now()
  const sameDay = new Date(at).toDateString() === new Date(now).toDateString() && at - now < GO_UPSELL_WINDOW

  return new Intl.DateTimeFormat(
    locale,
    sameDay ? { timeStyle: "short" } : { dateStyle: "medium", timeStyle: "short" },
  ).format(at)
}

export const GoUpsellState = Persistence.struct({
  [GO_UPSELL_FREE_TIER_LAST_SEEN_AT]: Schema.NullOr(Schema.Finite),
  [GO_UPSELL_FREE_TIER_DONT_SHOW]: Schema.NullOr(Schema.Finite),
})

export function useUsageExceededDialogs(input?: {
  selection?: () => ModelSelection | undefined
  onDone?: () => void
}) {
  const sdk = useWorkspaceLocation()
  const dialog = useDialog()
  const { params } = useSessionLayout()

  const [chatgptUsageLimit] = persisted(
    Persist.global("chatgpt-usage-limit"),
    Persistence.struct({ lastSeenAt: Schema.NullOr(Schema.Finite) }),
    { lastSeenAt: null },
  )

  // EVIL PATCH: free-tier upsell dialog function removed entirely.

  onCleanup(
    sdk().event.on("session.step.failed", (evt) => {
      if (evt.data.sessionID !== params.id || dialog.active) return
      const error = evt.data.error

      // EVIL PATCH: free-tier upsell dialog disabled.

      if (error.type !== "provider.chatgpt-limit" && error.type !== "provider.chatgpt-workspace-limit") return

      if (chatgptUsageLimit.lastSeenAt && Date.now() - chatgptUsageLimit.lastSeenAt < CHATGPT_USAGE_LIMIT_WINDOW) return

      // EVIL PATCH: ChatGPT usage-limit upsell dialog disabled.
    }),
  )
}
