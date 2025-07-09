import { buildConverterFactory } from "./converter.ts";

import * as Locale from "../data/preset/cn2t.js";
import { ConverterFactory } from "./types.ts";

const createConverter: ConverterFactory = buildConverterFactory(Locale);

export { createConverter, Locale };
