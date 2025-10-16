import { Trie } from "./trie";
import type { ConverterOptions, DictGroup, LocalePreset } from "./types";

export class Converter<
	Locale extends LocalePreset<From, To>,
	From extends string | number | symbol = keyof Locale["from"],
	To extends string | number | symbol = keyof Locale["to"],
> {
	private trieArr: Trie[];

	constructor(
		public readonly locale: Locale,
		public readonly options: ConverterOptions<Locale, From, To>,
	) {
		const { from, to } = options;

		const dictGroups: DictGroup[] = [];

		if (from !== "t" && locale.from[from]) {
			dictGroups.push(locale.from[from]);
		}

		if (to !== "t" && locale.to[to]) {
			dictGroups.push(locale.to[to]);
		}

		this.trieArr = dictGroups.map((grp) => {
			const t = new Trie();
			t.loadDictGroup(grp);
			return t;
		});
	}

	convert(text: string): string {
		return this.trieArr.reduce((res, t) => t.convert(res), text);
	}
}
