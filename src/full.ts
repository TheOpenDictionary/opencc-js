import { buildConverterFactory } from "./converter.ts";

import * as Locale from "../data/preset/full.js";

const createConverter = buildConverterFactory(Locale);

export { createConverter, Locale };
