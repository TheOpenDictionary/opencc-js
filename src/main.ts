/**
 * 字典，範例："a alpha|b beta" 或 [["a", "alpha"], ["b", "beta"]]
 * @typedef {string|string[][]} DictLike
 */

/**
 * 字典群組
 * @typedef {DictLike[]} DictGroup
 */

/**
 * 地區設定資料
 * @typedef {object} LocalePreset
 * @property {object.<string, DictGroup>} from
 * @property {object.<string, DictGroup>} to
 */

/**
 * Dictionary, example: "a alpha|b beta" or [["a", "alpha"], ["b", "beta"]]
 */
export type DictLike = string | string[][];

/**
 * Dictionary group
 */
export type DictGroup = DictLike[];

/**
 * Locale preset data
 */
export interface LocalePreset {
  from: Record<string, DictGroup>;
  to: Record<string, DictGroup>;
}

// Define custom Map interface for Trie nodes with the trie_val property
interface TrieMap extends Map<number, TrieMap> {
  trie_val?: string;
}

/**
 * Trie 樹。
 */
export class Trie {
  // 使用 Map 實作 Trie 樹
  // Trie 的每個節點為一個 Map 物件
  // key 為 code point，value 為子節點（也是一個 Map）。
  // 如果 Map 物件有 trie_val 屬性，則該屬性為值字串，代表替換的字詞。

  map: TrieMap;

  constructor() {
    this.map = new Map() as TrieMap;
  }

  /**
   * 將一項資料加入字典樹
   * @param {string} s 要匹配的字串
   * @param {string} v 若匹配成功，則替換為此字串
   */
  addWord(s: string, v: string): void {
    let map = this.map;
    for (const c of s) {
      const cp = c.codePointAt(0) as number;
      const nextMap = map.get(cp);
      if (nextMap == null) {
        const tmp = new Map() as TrieMap;
        map.set(cp, tmp);
        map = tmp;
      } else {
        map = nextMap;
      }
    }
    map.trie_val = v;
  }

  /**
   * 讀取字典資料
   * @param {DictLike} d 字典
   */
  loadDict(d: DictLike): void {
    if (typeof d === 'string') {
      const entries = d.split('|');
      for (const line of entries) {
        const [l, r] = line.split(' ');
        this.addWord(l, r);
      }
    } else {
      for (const arr of d) {
        const [l, r] = arr;
        this.addWord(l, r);
      }
    }
  }

  /**
   * 讀取多個字典資料
   * @param {DictLike[]} arr 字典
   */
  loadDictGroup(arr: DictGroup): void {
    arr.forEach(d => {
      this.loadDict(d);
    });
  }

  /**
   * 根據字典樹中的資料轉換字串。
   * @param {string} s 要轉換的字串
   */
  convert(s: string): string {
    const t = this.map;
    const n = s.length, arr: string[] = [];
    let orig_i: number | null = null;
    for (let i = 0; i < n;) {
      let t_curr: TrieMap = t, k = 0, v: string | undefined;
      for (let j = i; j < n;) {
        const x = s.codePointAt(j) as number;
        j += x > 0xffff ? 2 : 1;

        const t_next = t_curr.get(x);
        if (typeof t_next === 'undefined') {
          break;
        }
        t_curr = t_next;

        const v_curr = t_curr.trie_val;
        if (typeof v_curr !== 'undefined') {
          k = j;
          v = v_curr;
        }
      }
      if (k > 0) { // 有替代
        if (orig_i !== null) {
          arr.push(s.slice(orig_i, i));
          orig_i = null;
        }
        arr.push(v as string);
        i = k;
      } else { // 無替代
        if (orig_i === null) {
          orig_i = i;
        }
        i += (s.codePointAt(i) as number) > 0xffff ? 2 : 1;
      }
    }
    if (orig_i !== null) {
      arr.push(s.slice(orig_i, n));
    }
    return arr.join('');
  }
}

/**
 * Create a OpenCC converter
 * @param  {...DictGroup} dictGroups
 * @returns The converter that performs the conversion.
 */
export function ConverterFactory(...dictGroups: DictGroup[]): (s: string) => string {
  const trieArr = dictGroups.map(grp => {
    const t = new Trie();
    t.loadDictGroup(grp);
    return t;
  });
  /**
   * The converter that performs the conversion.
   * @param {string} s The string to be converted.
   * @returns {string} The converted string.
   */
  function convert(s: string): string {
    return trieArr.reduce((res, t) => {
      return t.convert(res);
    }, s);
  }
  return convert;
}

/**
 * Converter options
 */
export interface ConverterOptions {
  from: string;
  to: string;
}

/**
 * Build Converter function with locale data
 * @param {LocalePreset} localePreset
 * @returns Converter function
 */
export function ConverterBuilder(localePreset: LocalePreset): (options: ConverterOptions) => (s: string) => string {
  return function Converter(options: ConverterOptions): (s: string) => string {
    let dictGroups: DictGroup[] = [];
    ['from', 'to'].forEach(type => {
      if (typeof options[type as keyof ConverterOptions] !== 'string') {
        throw new Error('Please provide the `' + type + '` option');
      }
      if (options[type as keyof ConverterOptions] !== 't') {
        dictGroups.push(localePreset[type as keyof LocalePreset][options[type as keyof ConverterOptions]]);
      }
    });
    return ConverterFactory.apply(null, dictGroups);
  }
}

/**
 * Create a custom converter.
 * @param {string[][]} dict The dictionary to be used for conversion.
 * @returns The converter that performs the conversion.
 */
export function CustomConverter(dict: string[][]): (s: string) => string {
  return ConverterFactory([dict]);
}

/**
 * HTML converter interface
 */
export interface HTMLConverterInterface {
  convert: () => void;
  restore: () => void;
}

/**
 * Create a HTML page converter.
 * @param {(s: string) => string} converter The converter that performs the conversion.
 * @param {HTMLElement} rootNode The root node for recursive conversions.
 * @param {string} fromLangTag The lang tag to be converted.
 * @param {string} toLangTag The lang tag of the conversion result.
 * @returns The HTML page converter.
 */
export function HTMLConverter(
  converter: (s: string) => string,
  rootNode: HTMLElement,
  fromLangTag: string,
  toLangTag: string
): HTMLConverterInterface {

  interface EnhancedElement extends HTMLElement {
    shouldChangeLang?: boolean;
    originalContent?: string;
    originalAlt?: string;
    originalValue?: string;
  }

  interface EnhancedNode extends Node {
    originalString?: string;
  }

  /**
   * Perform the conversion on the page.
   */
  function convert(): void {
    function inner(currentNode: Node, langMatched: boolean): void {
      /* class list 包含 ignore-opencc 的元素會跳過後續的轉換 */
      if (currentNode.nodeType === Node.ELEMENT_NODE &&
          (currentNode as HTMLElement).classList.contains('ignore-opencc')) return;

      const elementNode = currentNode as EnhancedElement;

      if (elementNode.lang === fromLangTag) {
        langMatched = true;
        elementNode.shouldChangeLang = true; // 記住 lang 屬性被修改了，以便恢復
        elementNode.lang = toLangTag;
      } else if (elementNode.lang && elementNode.lang.length) {
        langMatched = false;
      }

      if (langMatched) {
        /* Do not convert these elements */
        if (elementNode.tagName === 'SCRIPT') return;
        if (elementNode.tagName === 'STYLE') return;

        /* 處理特殊屬性 */
        if (elementNode.tagName === 'META' && (elementNode as any).name === 'description') {
          if (elementNode.originalContent == null) {
            elementNode.originalContent = (elementNode as any).content;
          }
          // Safely handle undefined originalContent
          if (elementNode.originalContent !== undefined) {
            (elementNode as any).content = converter(elementNode.originalContent);
          }
        } else if (elementNode.tagName === 'META' && (elementNode as any).name === 'keywords') {
          if (elementNode.originalContent == null) {
            elementNode.originalContent = (elementNode as any).content;
          }
          // Safely handle undefined originalContent
          if (elementNode.originalContent !== undefined) {
            (elementNode as any).content = converter(elementNode.originalContent);
          }
        } else if (elementNode.tagName === 'IMG') {
          if (elementNode.originalAlt == null) {
            elementNode.originalAlt = (elementNode as HTMLImageElement).alt;
          }
          (elementNode as HTMLImageElement).alt = converter(elementNode.originalAlt);
        } else if (elementNode.tagName === 'INPUT' && (elementNode as HTMLInputElement).type === 'button') {
          if (elementNode.originalValue == null) {
            elementNode.originalValue = (elementNode as HTMLInputElement).value;
          }
          (elementNode as HTMLInputElement).value = converter(elementNode.originalValue);
        }
      }

      for (const node of currentNode.childNodes) {
        const enhancedNode = node as EnhancedNode;
        if (node.nodeType === Node.TEXT_NODE && langMatched) {
          if (enhancedNode.originalString == null) {
            // Store the original string, handling null values
            enhancedNode.originalString = node.nodeValue || '';
          }
          node.nodeValue = converter(enhancedNode.originalString);
        } else {
          inner(node, langMatched);
        }
      }
    }
    inner(rootNode, false);
  }

  /**
   * Restore the page to the state before the conversion.
   */
  function restore(): void {
    function inner(currentNode: Node): void {
      /* class list 包含 ignore-opencc 的元素會跳過後續的轉換 */
      if (currentNode.nodeType === Node.ELEMENT_NODE &&
          (currentNode as HTMLElement).classList.contains('ignore-opencc')) return;

      const elementNode = currentNode as EnhancedElement;

      if (elementNode.shouldChangeLang) {
        elementNode.lang = fromLangTag;
      }

      const textNode = currentNode as EnhancedNode;
      if (textNode.originalString !== undefined) {
        currentNode.nodeValue = textNode.originalString;
      }

      /* 處理特殊屬性 */
      if (elementNode.tagName === 'META' && (elementNode as any).name === 'description') {
        if (elementNode.originalContent !== undefined) {
          (elementNode as any).content = elementNode.originalContent;
        }
      } else if (elementNode.tagName === 'META' && (elementNode as any).name === 'keywords') {
        if (elementNode.originalContent !== undefined) {
          (elementNode as any).content = elementNode.originalContent;
        }
      } else if (elementNode.tagName === 'IMG') {
        if (elementNode.originalAlt !== undefined) {
          (elementNode as HTMLImageElement).alt = elementNode.originalAlt;
        }
      } else if (elementNode.tagName === 'INPUT' && (elementNode as HTMLInputElement).type === 'button') {
        if (elementNode.originalValue !== undefined) {
          (elementNode as HTMLInputElement).value = elementNode.originalValue;
        }
      }

      for (const node of currentNode.childNodes) {
        inner(node);
      }
    }
    inner(rootNode);
  }

  return { convert, restore };
}