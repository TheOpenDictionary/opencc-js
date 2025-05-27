export const variants2standard: Record<string, string[]> = {
  cn: ["STCharacters", "STPhrases"],
  hk: ["HKVariantsRev", "HKVariantsRevPhrases"],
  tw: ["TWVariantsRev", "TWVariantsRevPhrases"],
  twp: ["TWVariantsRev", "TWVariantsRevPhrases", "TWPhrasesRev"],
  jp: ["JPVariantsRev", "JPShinjitaiCharacters", "JPShinjitaiPhrases"],
};

export const standard2variants: Record<string, string[]> = {
  cn: ["TSCharacters", "TSPhrases"],
  hk: ["HKVariants"],
  tw: ["TWVariants"],
  twp: ["TWVariants", "TWPhrasesIT", "TWPhrasesName", "TWPhrasesOther"],
  jp: ["JPVariants"],
};
