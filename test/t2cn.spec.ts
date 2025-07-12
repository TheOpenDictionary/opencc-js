import { describe, expect, it } from "bun:test";

import { createConverter } from "../src/t2cn";

describe("t2cn Converter", () => {
	it("converts from Traditional to Simplified Chinese", () => {
		const converter = createConverter({ from: "tw", to: "cn" });
		expect(converter("漢字")).toBe("汉字");
		expect(converter("我們在吃方便麵。")).toBe("我们在吃方便面。");
	});
});
