// Deno-specific test for opencc-js
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Converter } from "../../src/full.ts";

Deno.test("OpenCC should convert simplified Chinese to traditional Chinese", () => {
  const converter = Converter({ from: 'cn', to: 'tw' });
  assertEquals(converter('汉字'), '漢字');
  assertEquals(converter('我们在吃方便面。'), '我們在吃方便麵。');
});

Deno.test("OpenCC should convert traditional Chinese to simplified Chinese", () => {
  const converter = Converter({ from: 'tw', to: 'cn' });
  assertEquals(converter('漢字'), '汉字');
  assertEquals(converter('我們在吃方便麵。'), '我们在吃方便面。');
});