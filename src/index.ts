import { addSpace, removeRebundantSpace, removeSpace } from './space';
import { quoteSymbol, normalSymbol } from './punctuation';
import { paragraphText } from './paragraph';
import { searchDuplicates } from './duplicate-text';
import { searchAdWords } from './ad-words';
import { logger } from './utils';

interface Options {
  space?: boolean;
  punctuation?: boolean;
  paragraph?: boolean;
  paragraphMargin?: 'single' | 'double';
  duplicate?: boolean;
  dupThreshold?: number;
  adKeyWords?: boolean;
}
const defaults = {
  space: true,
  punctuation: true,
  paragraph: true,
  paragraphMargin: 'double' as 'double',
  duplicate: true,
  dupThreshold: 5,
  adKeyWords: true,
};
function proofread(text: string, options: Options = defaults) {
  let str = text;
  const settings = { ...defaults, ...options };
  if (settings.punctuation) {
    str = quoteSymbol(str);
    str = normalSymbol(str);
  }
  if (settings.space) {
    str = removeRebundantSpace(str);
    str = addSpace(str);
  }
  if (settings.paragraph) {
    if (settings.paragraphMargin === 'double') {
      str = paragraphText(str, 'double');
    } else {
      str = paragraphText(str, 'single');
    }
  }
  let duplicate;
  if (settings.duplicate) {
    duplicate = searchDuplicates(str, settings.dupThreshold);
  }
  let adKeyWords;
  if (settings.adKeyWords) {
    adKeyWords = searchAdWords(str);
  }
  const result = {
    data: str,
    checklist: { duplicate, adKeyWords },
    log: logger,
  };

  return result;
}

export { proofread };
