import { buildConverterFactory } from "./converter.ts";

import * as Locale from "../data/preset/cn2t.js";

const createConverter = buildConverterFactory(Locale);

export { createConverter, Locale };
