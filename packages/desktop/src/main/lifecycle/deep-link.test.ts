import { afterAll, beforeAll, describe, expect, test } from "bun:test"
import { consoleReturnWindow } from "./deep-link"

let previousChannel: string | undefined

beforeAll(() => {
  previousChannel = process.env.OPENCODE_CHANNEL
  process.env.OPENCODE_CHANNEL = "evil"
})

afterAll(() => {
  if (previousChannel === undefined) delete process.env.OPENCODE_CHANNEL
  else process.env.OPENCODE_CHANNEL = previousChannel
})

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
