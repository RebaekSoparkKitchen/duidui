import * as chai from 'chai';
import {
  findPatterns,
  previousChar,
  dReplaceAt,
  dInsertAt,
  isNumber,
  findPatternsByRegex,
  findInterval,
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
    it('should find right index of <b> and </b>', () => {
      const sample = '我喜欢<b>哈哈哈</b>';
      const pattern = ['<b>', '</b>'];
      const res = findPatterns(sample, pattern);
      const expected = [
        [3, 5],
        [9, 12],
      ];
      assert.deepEqual(res, expected);
    });
  });
  describe('findPatternsByRegex', () => {
    it('should find index by single regex', () => {
      const regexp = /bar/g;
      const str = 'foobarfoobar';
      const res = findPatternsByRegex(str, regexp);
      const expected = [
        [3, 5],
        [9, 11],
      ];
      assert.deepEqual(res, expected);
    });
    it('should find index by multiple regexs', () => {
      const regexp = [new RegExp('bar', 'g'), new RegExp('foo', 'g')];
      const str = 'foobarfoobar';
      const res = findPatternsByRegex(str, regexp);
      const expected = [
        [3, 5],
        [9, 11],
        [0, 2],
        [6, 8],
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
  describe('isNumber()', () => {
    it('should return false when number and char mixed', () => {
      const sample = `redpig12`;
      assert.notOk(isNumber(sample));
    });
    it('shoule ok when it is a number', () => {
      assert.ok(isNumber('0'));
    });
    it('should return false when it is not a number', () => {
      assert.notOk(isNumber('x'));
    });
  });
  describe('findInterval()', () => {
    it('should work with positive test', () => {
      const textRange = [
        [3, 5],
        [7, 9],
      ];
      const length = 12;
      const res = findInterval(length, textRange);
      const expect = [
        [0, 2],
        [6, 6],
        [10, 11],
      ];
      assert.deepEqual(res, expect);
    });
    it('it should work when given ranges at start and end', () => {
      const textRange = [
        [0, 3],
        [7, 9],
      ];
      const length = 10;
      const res = findInterval(length, textRange);
      const expect = [[4, 6]];
      assert.deepEqual(res, expect);
    });
  });
});
