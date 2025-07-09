/**
 * Dictionary group
 */
export type DictGroup = Record<string, string>[];

/**
 * Locale preset data
 */
export interface LocalePreset {
  from: Record<string, DictGroup>;
  to: Record<string, DictGroup>;
}

/**
 * Converter options
 */
export interface ConverterOptions {
  from: string;
  to: string;
}

/**
 * Converter function type
 */
export type Converter = (text: string) => string;

/**
 * Converter factory type
 */
export type ConverterFactory = (options: ConverterOptions) => Converter;
