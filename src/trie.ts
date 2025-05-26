// Trie implementation for opencc-js, supporting only JSON dictionary format

interface TrieMap extends Map<number, TrieMap> {
  trie_val?: string;
}

export class Trie {
  map: TrieMap;

  constructor() {
    this.map = new Map() as TrieMap;
  }

  /**
   * Add a word to the trie
   * @param s The string to match
   * @param v The string to replace with
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
   * Load a JSON dictionary (Record<string, string>)
   * @param dict JSON dictionary
   */
  loadDict(dict: Record<string, string>): void {
    for (const [key, value] of Object.entries(dict)) {
      this.addWord(key, value);
    }
  }

  /**
   * Load multiple JSON dictionaries
   * @param dicts Array of JSON dictionaries
   */
  loadDictGroup(dicts: Record<string, string>[]): void {
    dicts.forEach((dict) => {
      this.loadDict(dict);
    });
  }

  /**
   * Convert a string using the trie
   * @param s The string to convert
   */
  convert(s: string): string {
    const t = this.map;
    const n = s.length,
      arr: string[] = [];
    let orig_i: number | null = null;
    for (let i = 0; i < n; ) {
      let t_curr: TrieMap = t,
        k = 0,
        v: string | undefined;
      for (let j = i; j < n; ) {
        const x = s.codePointAt(j) as number;
        j += x > 0xffff ? 2 : 1;

        const t_next = t_curr.get(x);
        if (typeof t_next === "undefined") {
          break;
        }
        t_curr = t_next;

        const v_curr = t_curr.trie_val;
        if (typeof v_curr !== "undefined") {
          k = j;
          v = v_curr;
        }
      }
      if (k > 0) {
        // Replacement found
        if (orig_i !== null) {
          arr.push(s.slice(orig_i, i));
          orig_i = null;
        }
        arr.push(v as string);
        i = k;
      } else {
        // No replacement
        if (orig_i === null) {
          orig_i = i;
        }
        i += (s.codePointAt(i) as number) > 0xffff ? 2 : 1;
      }
    }
    if (orig_i !== null) {
      arr.push(s.slice(orig_i, n));
    }
    return arr.join("");
  }
}
