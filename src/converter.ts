import { Trie } from "./trie";
import type { ConverterOptions, DictGroup, LocalePreset } from "./types";

/**
 * Build Converter function with locale data
 */
export const buildConverterFactory =
	(localePreset: LocalePreset) => (options: ConverterOptions) => {
		const { from, to } = options;

		const dictGroups: DictGroup[] = [];

		if (from !== "t" && localePreset.from[from]) {
			dictGroups.push(localePreset.from[from]);
		}

		if (to !== "t" && localePreset.to[to]) {
			dictGroups.push(localePreset.to[to]);
		}

		const trieArr = dictGroups.map((grp) => {
			const t = new Trie();
			t.loadDictGroup(grp);
			return t;
		});

		return (s: string): string =>
			trieArr.reduce((res, t) => {
				return t.convert(res);
			}, s);
	};
