const adWordTrie = require('./data/ad-keywords-trie.json');
const AhoCorasick = require('ahocorasick');

/**
 * we don't call init in our daily work
 * it will be called if and only if when we update the ad keywords
 */
function init() {
  const traverse = require('traverse');
  const fs = require('fs');
  const adKeywords = require('./data/ad-keywords.json');
  const savePath = './data/ad-keywords-trie.json';
  let keywords = [];
  traverse(adKeywords).forEach((x) => {
    if (Array.isArray(x)) keywords = keywords.concat(x);
  });
  const ac = new AhoCorasick(keywords);
  fs.writeFileSync(savePath, JSON.stringify(ac));
}

interface SearchResult {
  indexRange: [number, number];
  word: string;
}
/**
 * search ad keywords in the target text
 * @param text target text
 * @returns a list which contains results
 */

function searchAdWords(text: string): SearchResult[] {
  let ac = new AhoCorasick([]);
  ac = Object.assign(ac, adWordTrie);
  const res = ac.search(text);
  const ans = [];
  return res.map((x) => {
    const word = x[1][0];
    return { indexRange: [x[0] - word.length + 1, x[0]], word } as SearchResult;
  });
}

export { searchAdWords, init };
