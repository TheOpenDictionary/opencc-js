import { describe, expect, it } from "bun:test";

import { Converter } from "../src";

describe("full converter", () => {
	it("converts from Hong Kong to Simplified Chinese", () => {
		const converter = new Converter({ from: "hk", to: "cn" });
		expect(converter.convert("政府初步傾向試驗為綠色專線小巴設充電裝置")).toBe(
			"政府初步倾向试验为绿色专线小巴设充电装置",
		);
	});

	it("converts from Traditional to Simplified Chinese", () => {
		const converter = new Converter({ from: "t", to: "cn" });
		expect(converter.convert("漢語")).toBe("汉语");
	});

	it("converts from Simplified Chinese to Taiwan phrases", () => {
		const converter = new Converter({ from: "cn", to: "twp" });
		expect(converter.convert("方便面")).toBe("泡麵");
	});
});
