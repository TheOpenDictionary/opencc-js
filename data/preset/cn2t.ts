import from_cn from "../from/cn.ts";
import to_hk from "../to/hk.ts";
import to_tw from "../to/tw.ts";
import to_twp from "../to/twp.ts";
import to_jp from "../to/jp.ts";

const fromDicts = {
    cn: from_cn
};

const toDicts = {
    hk: to_hk,
    tw: to_tw,
    twp: to_twp,
    jp: to_jp
};

export {fromDicts as from, toDicts as to};