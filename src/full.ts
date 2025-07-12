import * as Locale from "../data/preset/full.js";

import { buildConverterFactory } from "./converter.ts";
import type { ConverterFactory } from "./types.ts";

const createConverter: ConverterFactory = buildConverterFactory(Locale);

export { createConverter, Locale };
