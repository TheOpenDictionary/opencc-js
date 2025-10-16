import { describe, expect, it } from "bun:test";

import { Converter } from "../src/cn2t";

describe("cn2t Converter", () => {
	it("converts from Simplified to Traditional Chinese", () => {
		const converter = new Converter({ from: "cn", to: "tw" });
		expect(converter.convert("汉字")).toBe("漢字");
		expect(converter.convert("我们在吃方便面。")).toBe("我們在吃方便麵。");
	});
});
