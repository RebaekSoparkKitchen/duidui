import * as chai from 'chai';
const assert = chai.assert;
import { searchAdWords } from '../src/ad-words';

describe('ad-words', () => {
  describe('search()', () => {
    it('should return a blank array', () => {
      const sample = '这个是业界不错的产品';
      const res = searchAdWords(sample);
      assert.deepEqual(res, []);
    });
    it('should find some ad words', () => {
      const sample = '这个是业界最好的产品';
      const res = searchAdWords(sample);
      assert.deepEqual(res, [
        { indexRange: [5, 5], word: '最' },
        { indexRange: [5, 6], word: '最好' },
      ]);
    });
  });
});
