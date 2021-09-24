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
  start: number;
  end: number;
  word: string;
}
/**
 *
 * @param text target text
 * @returns
 */

function search(text: string): SearchResult[] {
  let ac = new AhoCorasick([]);
  ac = Object.assign(ac, adWordTrie);
  const res = ac.search(text);
  const ans = [];
  return res.map((x) => {
    const word = x[1][0];
    return { start: x[0] - word.length + 1, end: x[0], word } as SearchResult;
  });
}

export { search, init };
