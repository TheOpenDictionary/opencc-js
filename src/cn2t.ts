import * as Locale from "../data/preset/cn2t.js";

import { Converter as BaseConverter } from "./converter.ts";
import type { ConverterOptions } from "./types.ts";

export class Converter extends BaseConverter<typeof Locale> {
	constructor(options: ConverterOptions<typeof Locale>) {
		super(Locale, options);
	}
}
