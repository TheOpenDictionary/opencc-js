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
   * @param sourceText The string to match
   * @param replacementText The string to replace with
   */
  addWord(sourceText: string, replacementText: string): void {
    let currentMap = this.map;

    // Traverse through each character, creating trie nodes as needed
    for (const character of sourceText) {
      const codePoint = character.codePointAt(0) as number;
      const existingNode = currentMap.get(codePoint);

      if (existingNode == null) {
        const newNode = new Map() as TrieMap;
        currentMap.set(codePoint, newNode);
        currentMap = newNode;
      } else {
        currentMap = existingNode;
      }
    }

    // Store the replacement value at the end of the word path
    currentMap.trie_val = replacementText;
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
   * @param inputString The string to convert
   */
  convert(inputString: string): string {
    const rootMap = this.map;
    const inputLength = inputString.length;
    const resultParts: string[] = [];
    let unconvertedStartIndex: number | null = null;

    for (let currentIndex = 0; currentIndex < inputLength; ) {
      let currentTrieNode: TrieMap = rootMap;
      let longestMatchEndIndex = 0;
      let longestMatchValue: string | undefined;

      // Find the longest matching pattern starting at currentIndex
      for (let searchIndex = currentIndex; searchIndex < inputLength; ) {
        const codePoint = inputString.codePointAt(searchIndex) as number;
        // Move to next character (handling surrogate pairs for Unicode)
        searchIndex += codePoint > 0xffff ? 2 : 1;

        const nextTrieNode = currentTrieNode.get(codePoint);
        if (typeof nextTrieNode === "undefined") {
          break; // No more matches possible
        }
        currentTrieNode = nextTrieNode;

        // Check if current node has a replacement value
        const currentNodeValue = currentTrieNode.trie_val;
        if (typeof currentNodeValue !== "undefined") {
          longestMatchEndIndex = searchIndex;
          longestMatchValue = currentNodeValue;
        }
      }

      if (longestMatchEndIndex > 0) {
        // Found a replacement - process any unconverted text first
        if (unconvertedStartIndex !== null) {
          resultParts.push(
            inputString.slice(unconvertedStartIndex, currentIndex),
          );
          unconvertedStartIndex = null;
        }
        // Add the replacement text
        resultParts.push(longestMatchValue as string);
        currentIndex = longestMatchEndIndex;
      } else {
        // No replacement found - mark start of unconverted section
        if (unconvertedStartIndex === null) {
          unconvertedStartIndex = currentIndex;
        }
        // Move to next character (handling surrogate pairs)
        const codePoint = inputString.codePointAt(currentIndex) as number;
        currentIndex += codePoint > 0xffff ? 2 : 1;
      }
    }

    // Add any remaining unconverted text
    if (unconvertedStartIndex !== null) {
      resultParts.push(inputString.slice(unconvertedStartIndex, inputLength));
    }

    return resultParts.join("");
  }
}
