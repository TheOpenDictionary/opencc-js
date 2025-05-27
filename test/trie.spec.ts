import { describe, it, expect } from "vitest";

import { Trie } from "../src/trie";

describe("Trie", () => {
  it("handles basic word conversions", () => {
    const trie = new Trie();
    trie.addWord("abc", "123");
    trie.addWord("abcd", "4");
    expect(trie.convert("ab")).toBe("ab");
    expect(trie.convert("abc")).toBe("123");
    expect(trie.convert("abcd")).toBe("4");
    expect(trie.convert("abcde")).toBe("4e");
    expect(trie.convert("dabc")).toBe("d123");
    expect(trie.convert("dabcd")).toBe("d4");
  });

  it("handles Unicode characters correctly", () => {
    const trie = new Trie();
    trie.addWord("𦫖𩇩", "aaa");
    trie.addWord("的𫟃", "bbb");
    expect(trie.convert("𦫖𩇩𭞂的𫟃")).toBe("aaa𭞂bbb");
    expect(trie.convert("𦫖𭞂𩇩的𫟃")).toBe("𦫖𭞂𩇩bbb");
  });

  it("supports custom conversion rules", () => {
    const trie = new Trie();
    trie.loadDict({
      香蕉: "🍌️",
      蘋果: "🍎️",
      梨: "🍐️",
    });

    expect(trie.convert("香蕉蘋果梨")).toBe("🍌️🍎️🍐️");
  });
});
