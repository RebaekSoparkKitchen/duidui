import chai = require('chai');
const assert = chai.assert;
import * as duidui from '../src/index';

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
    it('shoule avoid any space from real case1', () => {
      const sample = `届时，<b>我们将全网直播本届峰会上午的「主旨演讲」</b>`;
      const res = duidui.proofread(sample);
      const expected = `届时，<b>我们将全网直播本届峰会上午的「主旨演讲」</b>`;
      assert.equal(res.data, expected);

      const sample1 = `中国在联合国大会上向全世界公布了关于<b>「双碳」</b>的重大承诺`;
      const res1 = duidui.proofread(sample1);
      const expected1 = `中国在联合国大会上向全世界公布了关于<b>「双碳」</b>的重大承诺`;
      assert.strictEqual(res1.data, expected1);
    });
    it('should avoid any space from real case 2', () => {
      const sample = `10:00—11:30 am，<b>融通・创拓 | SAP 离散制造行业云上大讲堂 BTP 云专场</b>正式开启，`;
      const expected = `10:00—11:30 am，<b>融通・创拓 | SAP 离散制造行业云上大讲堂 BTP 云专场</b>正式开启，`;
      const res = duidui.proofread(sample, { paragraph: false });
      assert.strictEqual(res.data, expected);
    });
  });
});
