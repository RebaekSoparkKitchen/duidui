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
});
