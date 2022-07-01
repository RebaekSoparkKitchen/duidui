import * as chai from 'chai';
const assert = chai.assert;

import { removeSpace, addSpace, removeRebundantSpace } from '../src/space';

describe('space.ts', () => {
  describe('removeSpace()', () => {
    it('should not remove any space', () => {
      const sample = `白日依山尽 ， 啊， 黄河， 它入海流`;
      const expected = `白日依山尽 ， 啊， 黄河， 它入海流`;
      const res = removeSpace(sample, 0);
      assert.strictEqual(res, expected);
    });

    it('should remove any space', () => {
      const sample = `人生难得几回醉 ， 不欢更何待？ `;
      const expected = `人生难得几回醉，不欢更何待？`;
      const res = removeSpace(sample, 1);
      assert.strictEqual(res, expected);
    });

    it('should only remove two continuous spaces', () => {
      const sample = `啊哟，  谢天谢地了！ `;
      const expected = `啊哟，谢天谢地了！ `;
      const res = removeSpace(sample, 2);
      assert.strictEqual(res, expected);
    });
  });
  describe('addSpace()', () => {
    it('should add space between chinese and english', () => {
      const sample = `美酒加coffee,我也来一杯`;
      const expected = `美酒加 coffee, 我也来一杯`;
      const res = addSpace(sample);
      assert.strictEqual(res, expected);
    });
    it('should skip html tag', () => {
      const sample = `美酒加coffee,<b>我也来</b>一杯`;
      const expected = `美酒加 coffee,<b> 我也来</b>一杯`;
      const res = addSpace(sample);
      assert.strictEqual(res, expected);
    });
    it('should avoid add space around chinese punctions', () => {
      const sample = '白日依山尽，“黄河”入海流';
      const res = addSpace(sample);
      const expected = '白日依山尽，“黄河”入海流';
      assert.strictEqual(res, expected);
    });
    it('should add space when for english in <b> and chinese outside', () => {
      const sample = '那一年我二十一岁，在我一生的<b>gold</b>时代。';
      const res = addSpace(sample);
      const expected = '那一年我二十一岁，在我一生的<b> gold</b> 时代。';
      assert.strictEqual(res, expected);
    });
    it('should not add space for chinese punction and english', () => {
      const sample = '太阳当空照，flower对我笑';
      const res = addSpace(sample);
      const expected = '太阳当空照，flower 对我笑';
      assert.strictEqual(res, expected);
    });
  });
  describe('removeRebundantSpace()', () => {
    it('should remove rebundant space', () => {
      const sample = `计算机是一个 伟大的  发明`;
      const expected = `计算机是一个 伟大的 发明`;
      const res = removeRebundantSpace(sample);
      assert.strictEqual(res, expected);
    });
  });
});
