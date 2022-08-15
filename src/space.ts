import { htmlWrapper } from './html-processor';
import {
  dReplace,
  dReplaceAt,
  findPatterns,
  dInsertAt,
  findPatternsByRegex,
} from './utils';
const pangu = require('pangu');
/**
 *
 * @param text the target string
 * @param count the space number need to match
 * @returns the string which has removed space
 */
function removeSpace(text: string, count: number = 1) {
  let str = text;
  const re = new RegExp(`\\s{${count}}`, 'g');
  str = dReplace(str, re, '');
  return str;
}

/**
 * the purpose of this function is to remove 2 or more than 2 contiunous spaces to 1 space
 * @param text target string
 * @returns
 */
function plainRemoveRebundantSpace(text: string) {
  let str = text;
  // means space appears at least twice in a time
  const re = new RegExp(`\\s{2,}`, 'g');
  str = dReplace(str, re, ' ');
  return str;
}

function removeRebundantSpace(text: string) {
  return htmlWrapper(text, plainRemoveRebundantSpace);
}

/**
 * add space in the right place
 * @param text target string
 * @returns
 */
function plainAddSpace(text: string) {
  let str = text;
  str = pangu.spacing(str);

  str = dReplace(str, `“ `, `“`);
  str = dReplace(str, ` “`, `“`);
  str = dReplace(str, `” `, `”`);
  str = dReplace(str, ` ”`, `”`);
  //   replacement for html tag
  str = dReplace(str, / </g, '<');
  str = dReplace(str, /< /g, '<');
  str = dReplace(str, / >/g, '>');
  str = dReplace(str, /> /g, '>');
  str = htmlSpace(str);
  return str;
}

function addSpace(text: string) {
  return htmlWrapper(text, plainAddSpace);
}

function htmlSpace(text: string) {
  let str = text;
  const patterns = findPatterns(text, [
    '<b>',
    '</b>',
    '<i>',
    '</i>',
    '<strong>',
    '</strong>',
  ]);

  // count works for insert, see line 66, if I insert a space, the pos I calculated
  // before will outdated, I use count to record how many spaces I have added
  let count = 0;
  patterns.forEach((pos) => {
    let textAroundTag = `${text[pos[0] - 1]}${text[pos[1] + 1]}`;
    if (pangu.spacing(textAroundTag).length !== textAroundTag.length) {
      // always insert space on the further point, actually either direction works
      count += 1;
      str = dInsertAt(str, pos[1] + count, ' ');
    }
  });
  return str;
}
export { removeSpace, addSpace, removeRebundantSpace };
