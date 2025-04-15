import { Trie, ConverterFactory, ConverterBuilder, CustomConverter, HTMLConverter } from "./main.ts";
import * as Locale from "../dist/esm-lib/preset/t2cn.js";

const Converter = ConverterBuilder(Locale);

export { Trie, ConverterFactory, Converter, CustomConverter, HTMLConverter, Locale };