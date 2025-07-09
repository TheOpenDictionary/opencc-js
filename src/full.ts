import { buildConverterFactory } from "./converter.ts";

import * as Locale from "../data/preset/full.js";
import { ConverterFactory } from "./types.ts";

const createConverter: ConverterFactory = buildConverterFactory(Locale);

export { createConverter, Locale };
