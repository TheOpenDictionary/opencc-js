import from_hk from "../from/hk.ts";
import from_tw from "../from/tw.ts";
import from_twp from "../from/twp.ts";
import from_jp from "../from/jp.ts";
import to_cn from "../to/cn.ts";

const fromDicts = {
    hk: from_hk,
    tw: from_tw,
    twp: from_twp,
    jp: from_jp
};

const toDicts = {
    cn: to_cn
};

export {fromDicts as from, toDicts as to};