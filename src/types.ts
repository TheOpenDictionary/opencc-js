/**
 * Dictionary group
 */
export type DictGroup = Record<string, string>[];

/**
 * Locale preset data
 */
export interface LocalePreset<
	From extends string | number | symbol,
	To extends string | number | symbol,
> {
	from: Record<From, DictGroup>;
	to: Record<To, DictGroup>;
}

/**
 * Converter options
 */
export interface ConverterOptions<
	Locale extends LocalePreset<From, To>,
	From extends string | number | symbol = keyof Locale["from"],
	To extends string | number | symbol = keyof Locale["to"],
> {
	from: From | "t";
	to: To | "t";
}

/**
 * Converter function type
 */
export type Converter = (text: string) => string;
