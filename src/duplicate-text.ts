interface HashTable<T> {
  [key: string]: T;
}

type IndexRange = [number, number];

/**
 * helper function: extract add key logic here
 * @param hash a hash table represents a fixed length text table
 * @param key target sliced text
 * @param value target index range
 * @param duplicateWords the overall duplicate words list
 */
function addKey(
  hash: HashTable<IndexRange[]>,
  key: string,
  value: IndexRange,
  duplicateWords: string[]
) {
  if (hash[key]) {
    hash[key].push([...value]);
    duplicateWords.push(key);
  } else {
    hash[key] = [[...value]];
  }
}

/**
 * the core algorithm to search replicate pattern(length k) in a given string(length n)
 * the main idea is using hash table to trade off
 *
 * time complexity: O(n)
 * space complexity: O(kn)
 *
 * @param text the target text
 * @param fixedLength the length of the searched string
 * @returns the hash table represents the search result
 */
function searchDuplicatesFixed(
  text: string,
  fixedLength: number
): HashTable<IndexRange[]> {
  if (fixedLength >= text.length) return {};
  const hashTable: HashTable<IndexRange[]> = {};
  const duplicateWords: string[] = [];
  for (let i = 0; i < text.length; i++) {
    // get the sliced text
    const currentText = text.substr(i, fixedLength);
    const range: IndexRange = [i, i + fixedLength - 1];
    // add the slice text in the hash table
    addKey(hashTable, currentText, range, duplicateWords);
  }
  // remove the text which appears only once
  const dupHash: HashTable<IndexRange[]> = {};
  duplicateWords.forEach((k) => (dupHash[k] = hashTable[k]));
  return dupHash;
}

/**
 * given a fixed length(k) pattern search result which is a hash table, would like to get the hash table of fixed length(k+1) pattern search
 * @param text the whole target string
 * @param hash given fixed length(k) pattern search result, and don' necessarily provide k
 * @returns the hash table represents the search result
 */
function longerHash(text: string, hash: object): HashTable<IndexRange[]> {
  let longerHashTable: HashTable<IndexRange[]> = {};
  let duplicateWords: string[] = [];
  /**
   * helper method
   * just simple implementation of deep equal(not that deep, just 1 layer) for two arrays
   * @param arr1 an array
   * @param arr2 an array
   * @returns if they are deeply equal
   */
  function equals(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  /**
   * helper method
   * collect search result to longerHashTable
   * @param text the target string
   * @param hash the hash table represents k length pattern search result
   * @param direction represents the direction of extention on the basis of the pattern with length k
   */
  function process(text: string, hash: object, direction: 'f' | 'b') {
    Object.values(hash).forEach((v) => {
      v.map((indexRange: number[]) => {
        const range: IndexRange =
          direction === 'b'
            ? [indexRange[0] - 1, indexRange[1]]
            : [indexRange[0], indexRange[1] + 1];
        if (range[0] < 0 || range[1] > text.length) {
          return null;
        }
        return range;
      })
        .filter((x: IndexRange) => !!x)
        .forEach((x: IndexRange) => {
          const slicedText = text.substring(x[0], x[1] + 1);
          if (longerHashTable[slicedText]) {
            let ranges = longerHashTable[slicedText];
            let isExist = true;
            ranges.forEach((range) => {
              if (equals(range, x)) {
                isExist = false;
                return;
              }
            });
            if (isExist) {
              duplicateWords.push(slicedText);
              longerHashTable[slicedText].push(x);
            }
          } else {
            longerHashTable[slicedText] = [x];
          }
        });
    });
  }
  // provides side effects and longerHashTable collect results
  process(text, hash, 'b');
  process(text, hash, 'f');
  let dupHash: HashTable<IndexRange[]> = {};

  duplicateWords.forEach((k) => (dupHash[k] = longerHashTable[k]));
  return dupHash;
}

/**
 * given a longer hash, this function will get rid of some fully dominant words (keys)
 * @param hash1 the search result regards to pattern (length k)
 * @param hash2 the search result regards to pattern (length k+1)
 * @returns a new hash represents the unduplicate information search result
 */
function filterDominatedWords(hash1: object, hash2: object) {
  /**
   * is arr1 fully included by arr2 ?
   * @param arr1 : the small one
   * @param arr2 : the big one
   */
  function isRangeContain(arr1: number[], arr2: number[]) {
    if (arr1.length !== 2 || arr2.length !== 2) {
      return false;
    }
    return arr1[0] >= arr2[0] && arr1[1] <= arr2[1];
  }
  const newHash: HashTable<IndexRange[]> = {};
  const dominantedWords: string[] = [];
  for (let key1 in hash1) {
    for (let key2 in hash2) {
      if (hash1[key1].length !== hash2[key2].length) continue;
      const value1 = hash1[key1];
      const value2 = hash2[key2];
      let contains = true;
      // not so good have 3 for loop here, but typically the elements won't be too many here
      for (let i = 0; i < hash1[key1].length; i++) {
        if (!isRangeContain(value1[i], value2[i])) {
          contains = false;
          break;
        }
      }
      if (contains) dominantedWords.push(key1);
    }
  }
  Object.keys(hash1).forEach((key) => {
    if (!dominantedWords.includes(key)) {
      newHash[key] = hash1[key];
    }
  });
  return newHash;
}
/**
 * search pattern(length > k) in a given text
 * @param text: the given text
 * @param minLength: the minimum length of the searched pattern
 * @returns a search result which represents by a hash table
 */
function searchDuplicates(
  text: string,
  minLength: number
): HashTable<IndexRange[]>[] {
  let hashTable = searchDuplicatesFixed(text, minLength);
  let nextHash = longerHash(text, hashTable);
  function f(hash: HashTable<IndexRange[]>) {
    let longerHashTable = longerHash(text, hash);
    nextHash = longerHashTable;
    hashTable = filterDominatedWords(hash, longerHashTable);
    return { ...hashTable };
  }
  let collections = [f(hashTable)];
  while (Object.keys(nextHash).length > 0) {
    collections.push(f(nextHash));
  }
  const removeBlankCollections = collections.filter(
    (hash: HashTable<IndexRange[]>) => Object.keys(hash).length > 0
  );
  return removeBlankCollections;
}
export {
  searchDuplicatesFixed,
  longerHash,
  filterDominatedWords,
  searchDuplicates,
};
