import from_cn from "../from/cn.ts";
import from_hk from "../from/hk.ts";
import from_jp from "../from/jp.ts";
import from_tw from "../from/tw.ts";
import from_twp from "../from/twp.ts";
import to_cn from "../to/cn.ts";
import to_hk from "../to/hk.ts";
import to_jp from "../to/jp.ts";
import to_tw from "../to/tw.ts";
import to_twp from "../to/twp.ts";

const fromDicts = {
	cn: from_cn,
	hk: from_hk,
	tw: from_tw,
	twp: from_twp,
	jp: from_jp,
};

const toDicts = {
	cn: to_cn,
	hk: to_hk,
	tw: to_tw,
	twp: to_twp,
	jp: to_jp,
};

export { fromDicts as from, toDicts as to };
