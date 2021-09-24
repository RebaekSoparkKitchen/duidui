import chai = require('chai');
const assert = chai.assert;
import { search } from '../src/ad-words-filter';

describe('ad-words-filter', () => {
  describe('search()', () => {
    it('should return a blank array', () => {
      const sample = '这个是业界不错的产品';
      const res = search(sample);
      assert.deepEqual(res, []);
    });
    it('should find some ad words', () => {
      const sample = '这个是业界最好的产品';
      const res = search(sample);
      assert.deepEqual(res, [
        { start: 5, end: 5, word: '最' },
        { start: 5, end: 6, word: '最好' },
      ]);
    });
  });
});
