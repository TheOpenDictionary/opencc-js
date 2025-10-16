import { describe, expect, it } from "bun:test";

import { Converter } from "../src/t2cn";

describe("t2cn Converter", () => {
	it("converts from Traditional to Simplified Chinese", () => {
		const converter = new Converter({ from: "tw", to: "cn" });
		expect(converter.convert("漢字")).toBe("汉字");
		expect(converter.convert("我們在吃方便麵。")).toBe("我们在吃方便面。");
	});
});
