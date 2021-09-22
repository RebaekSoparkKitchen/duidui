import chai = require('chai');
import {
  findPatterns,
  previousChar,
  dReplaceAt,
  dInsertAt,
} from '../src/utils';
const assert = chai.assert;
describe('utils', () => {
  describe('previousChar()', () => {
    it('should return null in the first index', () => {
      const sample0 = `,ahaha`;
      const sample1 = `  ,ahaha`;
      const res0 = previousChar(sample0, 0);
      const res1 = previousChar(sample1, 2);
      assert.isNull(res0);
      assert.isNull(res1);
    });
    it('should return something', () => {
      const sample = `xuzi, ahaha`;
      const res = previousChar(sample, 4);
      assert.strictEqual(res, 'i');
    });
    it('should skip \\n', () => {
      const sample = `xuzi
      
      ,ahaha`;
      const res = previousChar(sample, 6);
      assert.strictEqual(res, 'i');
    });
  });
  describe('findPatterns()', () => {
    it('should return blank array', () => {
      const sample = 'I want to drink Coca Cola.';
      const pattern = 'eat';
      const res = findPatterns(sample, pattern);
      const expected = [];

      assert.deepEqual(res, expected);
    });
    it('should return some indexes', () => {
      const sample = ` dog is just dog, cat is not dog.`;
      const pattern = 'dog';
      const res = findPatterns(sample, pattern);
      const expected = [
        [1, 3],
        [13, 15],
        [29, 31],
      ];
      assert.deepEqual(res, expected);
    });
    it('should find all of the elements in array', () => {
      const sample = ` dog is just dog, cat is not dog.`;
      const pattern = ['dog', 'is'];
      const res = findPatterns(sample, pattern);
      const expected = [
        [1, 3],
        [5, 6],
        [13, 15],
        [22, 23],
        [29, 31],
      ];
      assert.deepEqual(res, expected);
    });
  });
  describe('dReplaceAt()', () => {
    it('should replace single string in certain index', () => {
      const sample = `奥斯陆是一个港口`;
      const expected = `鹿特丹是一个港口`;
      const res = dReplaceAt(sample, 0, '鹿特丹');
      assert.strictEqual(expected, res);
    });
  });
  describe('dInsertAt()', () => {
    it('should insert something', () => {
      const sample = `新港有一个钻石米`;
      const expected = `新港有一个好吃的钻石米`;
      const res = dInsertAt(sample, 5, '好吃的');
      assert.strictEqual(res, expected);
    });
  });
});
