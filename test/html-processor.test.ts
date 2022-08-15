import {
  getTextIndex,
  getTextInfo,
  processHtmlText,
} from '../src/html-processor';
import * as chai from 'chai';
import { quoteSymbol, normalSymbol } from '../src/punctuation';
import { addSpace } from '../src/space';
const assert = chai.assert;

describe('html-processor', () => {
  describe('findTagsIndex()', () => {
    const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱</span><span lang="EN-US">xuzinan</span>`;
    const res = getTextIndex(sample);
    const expectTags = [
      [0, 45],
      [48, 54],
      [55, 73],
      [81, 87],
    ];
    const expectTexts = [
      [46, 47],
      [74, 80],
    ];
    assert.deepEqual(res.tagRange, expectTags);
    assert.deepEqual(res.textRange, expectTexts);
  });
  describe('getTextObject()', () => {
    it('should work under positive test', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱</span><span lang="EN-US">xuzinan</span>`;
      const res = getTextInfo(sample);
      assert.strictEqual(res.length, 6);
    });
  });
  describe('processHtmlText()', () => {
    it('should work with no extra operation, the simplest one', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱</span><span lang="EN-US">xuzinan</span>`;
      const res = processHtmlText(sample, (text) => text);
      const expect = sample;
      assert.strictEqual(res, expect);
    });

    it('should work with normal symbols with simple case', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱你,中国</span>`;
      const expected = `<span lang="ZH-CN" style="font-family：SimSun">我爱你，中国</span>`;
      const res = processHtmlText(sample, normalSymbol);
      assert.strictEqual(res, expected);
    });
    it('should work with normal symbols with margin case', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱你,</span><span>中国</span>`;
      const expected = `<span lang="ZH-CN" style="font-family：SimSun">我爱你，</span><span>中国</span>`;
      const res = processHtmlText(sample, normalSymbol);
      assert.strictEqual(res, expected);
    });
    it('should work with space - inside span', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱andy我爱</span>`;
      const res = processHtmlText(sample, addSpace);
      const expected = `<span lang="ZH-CN" style="font-family：SimSun">我爱 andy 我爱</span>`;
      assert.strictEqual(res, expected);
    });
    it('should work with space - surround spans', () => {
      const sample = `<span lang="ZH-CN" style="font-family：SimSun">我爱</span><span lang="EN-US">xuzinan</span>`;
      const res = processHtmlText(sample, addSpace);
      const expected = `<span lang="ZH-CN" style="font-family：SimSun">我爱</span><span lang="EN-US"> xuzinan</span>`;
      assert.strictEqual(res, expected);
    });
  });
});
