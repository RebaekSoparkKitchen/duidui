import chai = require('chai');
const assert = chai.assert;
import { quoteSymbol, normalSymbol } from '../src/punctuation';
describe('punctuation', () => {
  describe('quoteSymbol()', () => {
    it('should be blank', () => {
      const sample = ``;
      const res = quoteSymbol(sample);
      assert.strictEqual(res, ``);
    });
    it('should transfer english quote to chinese', () => {
      const sample = `我想要"可口可乐"`;
      const res = quoteSymbol(sample);
      assert.strictEqual(res, `我想要“可口可乐”`);
    });
    it('one english, one chinese quote, should be transferred to chinese quote', () => {
      const sample0 = `我想要"可口可乐“`;
      const sample1 = `我想要“可口可乐"`;
      const sample2 = `我想要"可口可乐”`;
      const res0 = quoteSymbol(sample0);
      const res1 = quoteSymbol(sample1);
      const res2 = quoteSymbol(sample2);
      const ans = `我想要“可口可乐”`;
      assert.strictEqual(res0, ans);
      assert.strictEqual(res1, ans);
      assert.strictEqual(res2, ans);
    });
    it('should be english quote when middle words are all in english', () => {
      const sample0 = `我想要"Coca Cola"`;
      const sample1 = `我想要“Coca Cola”`;
      const sample2 = `我想要“Coca Cola"`;
      const sample3 = `我想要"Coca Cola”`;
      const res0 = quoteSymbol(sample0);
      const res1 = quoteSymbol(sample1);
      const res2 = quoteSymbol(sample2);
      const res3 = quoteSymbol(sample3);
      const ans = `我想要"Coca Cola"`;
      assert.strictEqual(res0, ans);
      assert.strictEqual(res1, ans);
      assert.strictEqual(res2, ans);
      assert.strictEqual(res3, ans);
    });
    it('should be in chinese quote, if middle text contains some english and some chinese', () => {
      const sample = `我想要"可口 Cola"`;
      const res = `我想要“可口 Cola”`;
    });
    it('odd number quote, and should throw an error', () => {
      const sample = `我想“要"可口可乐"`;
      // make sure it is an error
      assert.throws(() => {
        const res = quoteSymbol(sample);
      }, Error);
      // make sure the error information is right
      assert.throws(() => {
        const res = quoteSymbol(sample);
      }, /The frequency of quotation characters is odd number/);
    });
    it('should not add any space', () => {
      const sample = '白日依山尽，“黄河"入海流';
      const expected = '白日依山尽，“黄河”入海流';
      const res1 = quoteSymbol(sample);
      const res = normalSymbol(res1);
      assert.strictEqual(expected, res);
    });
    it('should change chinese colon to english if it is surrounded by numbers', () => {
      const sample = '11：04';
      const expected = '11:04';
      const res = normalSymbol(sample);
      assert.strictEqual(expected, res);
    });
  });
  describe('normalSymbol()', () => {
    it('should change english comma to chinese', () => {
      const sample = `我爱你,中国`;
      const expected = `我爱你，中国`;
      const res = normalSymbol(sample);
      assert.strictEqual(res, expected);
    });
    it('space and \\n should be skipped', () => {
      const sample = `我爱你  ,中国。`;
      const expected = `我爱你  ，中国。`;
      const res = normalSymbol(sample);
      assert.strictEqual(res, expected);
    });
    it('should intelligently do decision about en/cn character', () => {
      const sample0 = `I love you，中国。`;
      const sample1 = `I love you,中国.`;
      const sample2 = `I love you， 中国.`;
      const expected = `I love you，中国。`;
      const res0 = normalSymbol(sample0);
      const res1 = normalSymbol(sample1);
      const res2 = normalSymbol(sample2);
      assert.strictEqual(res0, expected);
      assert.strictEqual(res1, expected);
      assert.strictEqual(res2, expected);
    });
  });
});
