import * as Locale from "../data/preset/cn2t.js";

import { buildConverterFactory } from "./converter.ts";
import type { ConverterFactory } from "./types.ts";

const createConverter: ConverterFactory = buildConverterFactory(Locale);

export { createConverter, Locale };
