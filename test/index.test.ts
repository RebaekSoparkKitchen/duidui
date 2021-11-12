import chai = require('chai');
const assert = chai.assert;
import duidui from '../src/index';

describe('index.ts', () => {
  describe('proofread()', () => {
    it('should return a corrected text', () => {
      const sample = `   
			白日依山尽，"黄河"入海流.
			`;
      const res = duidui.proofread(sample);
      const expected = '白日依山尽，“黄河”入海流。';
      assert.strictEqual(res.data, expected);
    });
  });
  describe('when meet <b>', () => {
    it('should not add space when meet <b>', () => {
      const sample = '那一年我二十一岁，在我一生的<b>黄金</b>时代。';
      const res = duidui.proofread(sample);
      const expected = '那一年我二十一岁，在我一生的<b>黄金</b>时代。';
      assert.strictEqual(res.data, expected);
    });
    it('should avoid add space meet chinese punctuation', () => {
      const sample = '那一年我二十一岁，在我一生的<b>gold</b>时代。';
      const res = duidui.proofread(sample);
      const expected = '那一年我二十一岁，在我一生的<b> gold</b> 时代。';
      assert.equal(res.data, expected);
    });
  });
});
