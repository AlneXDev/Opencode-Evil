import { createHash } from "crypto"
import { describe, expect, test } from "bun:test"
import { getProjectAvatarSource } from "./project-avatar"

describe("getProjectAvatarSource", () => {
  test("prefers a chosen image, then a chosen color, then the automatic icon", () => {
    expect(getProjectAvatarSource("abc", { override: "data:image/png;base64,AA==", url: "data:auto" })).toBe(
      "data:image/png;base64,AA==",
    )
    expect(getProjectAvatarSource("abc", { color: "blue", url: "data:auto" })).toBeUndefined()
    expect(getProjectAvatarSource("abc", { url: "data:auto" })).toBe("data:auto")
  })

  test("recognizes the OpenCode repository by its remote-derived project ID", () => {
    const id = createHash("sha1").update("git-remote:github.com/anomalyco/opencode").digest("hex")

    // evil-v2: the upstream project ID gets the red evil "O" instead of the stock favicon.
    expect(getProjectAvatarSource(id)).toContain("data:image/svg+xml")
    expect(getProjectAvatarSource(id)).toContain("ff5959")
    expect(getProjectAvatarSource(id, { override: "data:custom" })).toBe("data:custom")
    expect(getProjectAvatarSource(id, { color: "blue" })).toBeUndefined()
  })
})
