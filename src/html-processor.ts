import { findInterval, findPatternsByRegex } from './utils';

function findTagsIndex(text: string) {
  return findPatternsByRegex(text, /<\/?[a-z][^>]*>/gi);
}

function getTextIndex(text: string) {
  const tagRange = findTagsIndex(text);
  const textRange = findInterval(text.length, tagRange);

  return { tagRange, textRange };
}

type TextInfo = { data: string; type: 'text' | 'tag' };
function getTextInfo(text: string): TextInfo[] {
  const { tagRange, textRange } = getTextIndex(text);
  let pointer1 = 0;
  let pointer2 = 0;
  const info: TextInfo[] = [];

  do {
    if (
      pointer2 === textRange.length ||
      tagRange[pointer1][0] < textRange[pointer2][0]
    ) {
      info.push({
        data: text.substring(tagRange[pointer1][0], tagRange[pointer1][1] + 1),
        type: 'tag',
      } as TextInfo);
      pointer1 += 1;
    } else {
      info.push({
        data: text.substring(
          textRange[pointer2][0],
          textRange[pointer2][1] + 1
        ),
        type: 'text',
      } as TextInfo);
      pointer2 += 1;
    }
  } while (pointer1 != tagRange.length || pointer2 != textRange.length);

  return info;
}
function processHtmlText(text: string, cb: (x: string) => string) {
  const infoArr: TextInfo[] = getTextInfo(text);
  const textIndexArr: number[] = [];
  for (let i = 0; i < infoArr.length; i++) {
    const info = infoArr[i];
    if (info.type === 'text') {
      textIndexArr.push(i);
      info.data = cb(info.data);
      // 继续处理边缘情况
      if (textIndexArr.length === 1) {
        continue;
      }
      const lastTextIndex = textIndexArr[textIndexArr.length - 2];
      const lastText = infoArr[lastTextIndex].data;
      if (!lastText || lastText.length === 0) continue;
      const lastTextLastChar = lastText.charAt(lastText.length - 1);
      const mergedMarginText = lastTextLastChar + info.data.charAt(0);
      const processedMergedMarginText = cb(mergedMarginText);
      info.data =
        processedMergedMarginText.substring(1) + info.data.substring(1);
      infoArr[lastTextIndex].data =
        lastText.substring(0, lastText.length - 1) +
        processedMergedMarginText.charAt(0);
    }
  }
  const textArr = infoArr.map((info) => info.data);
  const result = textArr.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  return result;
}
export { getTextIndex, getTextInfo, processHtmlText };
