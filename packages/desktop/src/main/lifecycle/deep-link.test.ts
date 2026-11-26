import { describe, expect, mock, test } from "bun:test"

// evil-v2: the evil desktop registers only the `opencode-evil` protocol.
mock.module("../constants", () => ({ PROTOCOL_SCHEME: "opencode-evil" }))
const { consoleReturnWindow } = await import("./deep-link")

describe("Console return deep links", () => {
  test("reads the originating Desktop window", () => {
    expect(consoleReturnWindow("opencode-evil://console/authorized?window=window-a")).toBe("window-a")
    expect(consoleReturnWindow("opencode-evil://console/authorized?window=window%20b")).toBe("window b")
  })

  test("rejects unrelated and malformed links", () => {
    expect(consoleReturnWindow("opencode-evil://console/other?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("opencode-evil://other/authorized?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("https://console/authorized?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("not a url")).toBeUndefined()
    expect(consoleReturnWindow("opencode-evil://console/authorized")).toBeUndefined()
  })
})
