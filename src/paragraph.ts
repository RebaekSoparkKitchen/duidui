import { fchown } from 'fs';

/**
 * the main implementation of paragraph split, only work on a single lineBreak
 * @param text target string
 * @param lineBreak the lineBreak type, say <br>, \n
 * @returns a string[] which each element represents a paragraph
 */
function _norm(text: string, lineBreak: string) {
  let paragraphs = text.split(lineBreak);
  paragraphs = paragraphs
    .map((value) => value.trim())
    .filter((value) => !!value);
  return paragraphs;
}
/**
 * hard code all lineBreak in the function, and get the paragraph list
 * @param text target string
 * @returns a string[] which each element represents a paragraph
 */
function norm(text: string) {
  let str = text;
  let paragraphs: string[];
  const lineBreaks = [`\n`, `<br>`, `<br/>`, `<br />`];
  paragraphs = [str];
  // recursive call norm on each paragraph list and finally flat it.
  lineBreaks.forEach((lineBreak) => {
    paragraphs = paragraphs.map((p) => _norm(p, lineBreak)).flat();
  });
  return paragraphs;
}
/**
 *
 * @param text target string
 * @param output output type, determined it is /n or <br>
 * @param margin single row margin or double row margin
 * @returns
 */
function paragraphText(text: string, margin: 'single' | 'double') {
  let lineBreak: string;
  // intelligently judge if it is html or plain text
  const output = isHtml(text) ? 'html' : 'plain';
  switch (output) {
    case 'plain':
      lineBreak = margin === 'single' ? '\n' : '\n\n';
      return norm(text).join(lineBreak);
    case 'html':
      lineBreak = margin === 'single' ? '<br>' : '<br><br>';
      return norm(text).join(lineBreak);
    default:
      return text;
  }
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

export { norm, paragraphText, isHtml };
