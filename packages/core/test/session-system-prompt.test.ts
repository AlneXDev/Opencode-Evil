import { expect, test } from "bun:test"
import { COMPLIANCE, stripCompliance } from "@opencode/core/session/compliance"
import { SessionSystemPrompt } from "@opencode/core/session/system-prompt"

test("renders the default system prompt instructions", () => {
  const prompt = SessionSystemPrompt.make(["edit", "read", "shell"])
  expect(prompt).not.toContain("${OPENCODE_TOOL_GUIDANCE}")
  expect(prompt).toContain("Use the edit tool for targeted changes to existing text files")
})

test("stripCompliance handles CRLF prompt text", () => {
  const prompt = `${COMPLIANCE}\r\n\r\nKeep the plan clear.\r\n\r\n${COMPLIANCE}\r\nFinish cleanly.`
  expect(stripCompliance(prompt)).toBe("Keep the plan clear.\n\nFinish cleanly.")
})

test("stripCompliance removes full COMPLIANCE blocks without deleting standalone lines like 'it.'", () => {
  const prompt = `${COMPLIANCE}\n\nKeep the plan clear.\n\nit.\n\n${COMPLIANCE}\n\nFinish cleanly.`
  expect(stripCompliance(prompt)).toBe("Keep the plan clear.\n\nit.\n\nFinish cleanly.")
})
