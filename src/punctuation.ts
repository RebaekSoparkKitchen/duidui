import { dInsertAt, findPatterns } from './utils';
const isEnglish = require('is-english');
import { previousChar, dReplaceAt, isNumber } from './utils';
const punctuationSymbol: PunctuationSymbol = require('./data/punctationSymbol.json');

interface Character {
  value: string;
  lang: 'EN' | 'CN';
}
interface QuoteSymbol {
  CN: string[];
  EN: string;
}
interface NormalSymbol {
  CN: string;
  EN: string;
}

interface PunctuationSymbol {
  NORMAL: NormalSymbol[];
  QUOTE: QuoteSymbol[];
}
/**
 * helper function, deal with quotations in the text
 * @param text : target text
 * @returns the processed text
 */
const _quoteSymbol = (text: string, symbol: QuoteSymbol): string => {
  //  I need to have my own replaceall, when replace, record the index
  let str = text;
  const QUOTATION_SYMBOL = [...symbol['CN'], symbol['EN']];
  const positions = findPatterns(str, QUOTATION_SYMBOL);

  if (positions.length % 2 !== 0)
    throw new Error('The frequency of quotation characters is odd number');

  for (let i = 0; i < positions.length / 2; i++) {
    const firstQuotePos = positions[i * 2][0];
    const secondQuotePos = positions[i * 2 + 1][0];

    const middleText = text.substring(firstQuotePos + 1, secondQuotePos);
    // check if all of them are english
    if (!isEnglish(middleText)) {
      str = dReplaceAt(str, firstQuotePos, symbol['CN'][0]);
      str = dReplaceAt(str, secondQuotePos, symbol['CN'][1]);
    } else {
      str = dReplaceAt(str, firstQuotePos, symbol['EN']);
      str = dReplaceAt(str, secondQuotePos, symbol['EN']);
    }
  }
  return str;
};

function quoteSymbol(text: string) {
  let str = text;
  Object.values(punctuationSymbol.QUOTE).forEach((symbol) => {
    str = _quoteSymbol(str, symbol);
  });
  return str;
}

/**
 *
 * @param text : the target string
 * @param symbol:  the symbol I want to replace
 * @returns
 */
function _normalSymbol(text: string, symbol: NormalSymbol) {
  let str = text;
  const NORMAL_SYMBOL = [symbol['CN'], symbol['EN']];
  let positions = findPatterns(str, NORMAL_SYMBOL);
  for (let i = 0; i < positions.length; i++) {
    positions = findPatterns(str, NORMAL_SYMBOL);
    // if it is the first or last sentence, then default the prevous or next sentence is english
    const prevSentence =
      i > 0
        ? str.substring(positions[i - 1][1], positions[i][0])
        : str.substring(0, positions[i][0]);
    const nextSentence =
      i < positions.length - 1
        ? str.substring(positions[i][1], positions[i + 1][0])
        : str.substring(positions[i][1], str.length - 1);

    const pos = positions[i][0];

    if (isEnglish(prevSentence) && isEnglish(nextSentence)) {
      str = dReplaceAt(str, pos, symbol['EN']);
      // add space between english character and punctuation
      if (
        positions[i][1] < str.length - 1 &&
        str[positions[i][1] + 1] !== ' '
      ) {
        dInsertAt(str, positions[i][1] + 1, ' ');
      }
    } else {
      str = dReplaceAt(str, pos, symbol['CN']);
      // delete space between chinese character and punctuation
      if (
        positions[i][1] < str.length - 1 &&
        str[positions[i][1] + 1] === ' '
      ) {
        str = dReplaceAt(str, positions[i][1] + 1, '');
      }
    }
    // if a colon symbol's prev and after are both number, then transfer to english
    // the excution procedure is very important ~~
    if (
      symbol['CN'] == '：' &&
      isNumber(str[pos - 1]) &&
      isNumber(str[pos + 1])
    ) {
      str = dReplaceAt(str, pos, symbol['EN']);
    }
  }
  return str;
}

function normalSymbol(text: string) {
  let str = text;
  Object.values(punctuationSymbol.NORMAL).forEach((symbol) => {
    str = _normalSymbol(str, symbol);
  });
  return str;
}

export { quoteSymbol, normalSymbol };
