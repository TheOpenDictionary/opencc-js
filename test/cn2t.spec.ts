import { describe, expect, it } from "bun:test";

import { createConverter } from "../src/cn2t";

describe("cn2t Converter", () => {
  it("converts from Simplified to Traditional Chinese", () => {
    const converter = createConverter({ from: "cn", to: "tw" });
    expect(converter("汉字")).toBe("漢字");
    expect(converter("我们在吃方便面。")).toBe("我們在吃方便麵。");
  });
});
