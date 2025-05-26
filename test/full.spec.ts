import { describe, expect, it } from "vitest";

import { createConverter } from "../src/full";

describe("full converter", () => {
  it("converts from Hong Kong to Simplified Chinese", () => {
    const converter = createConverter({ from: "hk", to: "cn" });
    expect(converter("政府初步傾向試驗為綠色專線小巴設充電裝置")).toBe(
      "政府初步倾向试验为绿色专线小巴设充电装置",
    );
  });

  it("converts from Traditional to Simplified Chinese", () => {
    const converter = createConverter({ from: "t", to: "cn" });
    expect(converter("漢語")).toBe("汉语");
  });

  it("converts from Simplified Chinese to Taiwan phrases", () => {
    const converter = createConverter({ from: "cn", to: "twp" });
    expect(converter("方便面")).toBe("泡麵");
  });
});
