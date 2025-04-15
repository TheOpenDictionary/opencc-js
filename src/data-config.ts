export const variants2standard: Record<string, string[]> = {
  cn: ['STCharacters', 'STPhrases'],
  hk: ['HKVariantsRev', 'HKVariantsRevPhrases'],
  tw: ['TWVariantsRev', 'TWVariantsRevPhrases'],
  twp: ['TWVariantsRev', 'TWVariantsRevPhrases', 'TWPhrasesRev'],
  jp: ['JPVariantsRev', 'JPShinjitaiCharacters', 'JPShinjitaiPhrases'],
};

export const standard2variants: Record<string, string[]> = {
  cn: ['TSCharacters', 'TSPhrases'],
  hk: ['HKVariants'],
  tw: ['TWVariants'],
  twp: ['TWVariants', 'TWPhrasesIT', 'TWPhrasesName', 'TWPhrasesOther'],
  jp: ['JPVariants'],
};

interface PresetConfig {
  filename: string;
  from: string[];
  to: string[];
}

export const presets: PresetConfig[] = [
  {
    filename: 'full',
    from: Object.keys(variants2standard),
    to: Object.keys(standard2variants)
  },
  {
    filename: 'cn2t',
    from: ['cn'],
    to: ['hk', 'tw', 'twp', 'jp']
  },
  {
    filename: 't2cn',
    from: ['hk', 'tw', 'twp', 'jp'],
    to: ['cn']
  }
];