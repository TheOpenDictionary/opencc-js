import { buildConverterFactory } from "./converter.ts";

import * as Locale from "../data/preset/t2cn.js";

const createConverter = buildConverterFactory(Locale);

export { createConverter, Locale };
