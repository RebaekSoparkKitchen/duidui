// find all patterns in the text and return the index list
// params：text : the long content need to be scaned
// params： pattern : the string need to be found, say /n
// params：index : start point, very often we use 0, I set it basicly for the recursive call
function findPatterns(
  text: string,
  pattern: string | string[],
  index: number = 0
): number[][] {
  function f(text: string, pattern: string, index: number = 0): number[][] {
    const currentIndex = text.indexOf(pattern, index);

    if (currentIndex === -1) return [];
    else
      return [
        [currentIndex, currentIndex + pattern.length - 1],
        ...f(text, pattern, currentIndex + 1),
      ];
  }
  switch (typeof pattern) {
    case 'string':
      return f(text, pattern, index);
    default:
      if (pattern.length === 0)
        throw new Error('invalid pattern input, at least one element.');
      else if (pattern.length === 1) {
        return f(text, pattern[0], index);
      } else {
        const answer = [
          ...findPatterns(text, pattern.slice(1), index),
          ...f(text, pattern[0], index),
        ];

        return answer.sort((a: number[], b: number[]) => a[0] - b[0]);
      }
  }
}

function findPatternsByRegex(text: string, reg: RegExp | RegExp[]): number[][] {
  function _findPatternsByRegex(text: string, reg: RegExp) {
    let result: number[][] = [];
    let matches = [...text.matchAll(reg)];
    matches.forEach((match) => {
      result.push([match.index, match.index + match[0].length - 1]);
    });
    return result;
  }
  if (!Array.isArray(reg)) {
    return _findPatternsByRegex(text, reg);
  }
  let collector = [];
  reg.forEach((r) => {
    collector = collector.concat(_findPatternsByRegex(text, r));
  });
  return collector;
}
/**
 * a replace method invoked by logger
 * @param text target string
 * @param searchValue the pattern need to match
 * @param replaceValue replaced value
 * @returns
 */
function dReplace(
  text: string,
  searchValue: string | RegExp,
  replaceValue: string
) {
  return text.replace(searchValue, (value, index) => {
    if (searchValue !== replaceValue) {
      logger.push({ index, value, replaceValue });
    }
    return replaceValue;
  });
}
/**
 * replace text[index] with replaceValue
 * @param text target string
 * @param index the index of the string
 * @param replaceValue the value I want to replace
 * @returns
 */
function dReplaceAt(text: string, index: number, replaceValue: string) {
  // in case replaceValue is blank
  const length = replaceValue.length ? replaceValue.length : 1;
  if (text.substr(index, length) !== replaceValue) {
    logger.push({ index, value: text[index], replaceValue });
  }
  return text.substr(0, index) + replaceValue + text.substr(index + length);
}

function dInsertAt(text: string, index: number, insertValue: string) {
  logger.push({ index, value: text[index], insertValue });
  return text.substr(0, index) + insertValue + text.substr(index);
}

/**
 * find the previous character of text[index], space and /n should be skipped
 * @param text target string
 * @param index the index of the target char
 * @returns
 */
function previousChar(text: string, index: number): string {
  // 从后往前进行正则匹配
  if (index === 0) return null;

  const previous: string = text.charAt(index - 1);
  if (previous === ' ' || previous === '\n')
    return previousChar(text, index - 1);

  return previous;
}

/**
 * to judge that if a sting can be correponding to a number
 * @param text the input text I want to know if it can be number, eg: "10"
 */
function isNumber(text: string): boolean {
  const n = Number(text);
  return !isNaN(n);
}

/**
 * to determine if a given text is html or plain text
 * @param text the target text
 * @returns html text -> true, plain text -> false
 */
function isHtml(text: string): boolean {
  const res = text.search(/<[^>]+>/);
  return res !== -1;
}

function findInterval(length: number, textRanges: number[][]) {
  const collector = [];
  if (textRanges.length === 0) return [[]];
  if (textRanges[0][0] > 0) {
    collector.push([0, textRanges[0][0] - 1]);
  }
  for (let i = 0; i < textRanges.length; i++) {
    if (textRanges[i][1] === length - 1) break;
    if (i === textRanges.length - 1) {
      const start = textRanges[i][1] + 1;
      const end = length - 1;
      if (start > end) continue;
      collector.push([start, end]);
    } else {
      const start = textRanges[i][1] + 1;
      const end = textRanges[i + 1][0] - 1;
      if (start > end) continue;
      collector.push([start, end]);
    }
  }
  return collector;
}

let logger: object[] = [];
export {
  findPatterns,
  findPatternsByRegex,
  previousChar,
  dReplace,
  dReplaceAt,
  dInsertAt,
  isNumber,
  isHtml,
  logger,
  findInterval,
};
