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
  if (text.substr(index, replaceValue.length) !== replaceValue) {
    logger.push({ index, value: text[index], replaceValue });
  }
  // in case replaceValue is blank
  const length = replaceValue.length ? replaceValue.length : 1;
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
let logger: object[] = [];
export { findPatterns, previousChar, dReplace, dReplaceAt, dInsertAt, logger };
