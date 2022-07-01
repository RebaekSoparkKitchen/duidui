import * as chai from 'chai';
const assert = chai.assert;
import { norm, paragraphText, isHtml } from '../src/paragraph';

describe('paragraph', () => {
  describe('norm()', () => {
    it('should return paragraph list', () => {
      const sample = `
			
			william

			luo<br>luo

			flying<br/>pig
			`;
      const expected = ['william', 'luo', 'luo', 'flying', 'pig'];
      const res = norm(sample);

      assert.deepEqual(expected, res);
    });
    it('should not split paragraphs, only trim', () => {
      const sample = `   如此这样三十年 `;
      const expected = [`如此这样三十年`];
      const res = norm(sample);
      assert.deepEqual(expected, res);
    });
  });
  describe('paragraphText()', () => {
    it('should return plain text and reset line break to single', () => {
      const sample = `白日依山尽
			  
			 黄河入海流
			 
			 `;
      const expected = '白日依山尽\n黄河入海流';
      const res = paragraphText(sample, 'single');
      assert.strictEqual(res, expected);
    });
    it('should return html text and reset to single lineBreak numbers', () => {
      const sample = '白日依山尽<br><br>黄河入海流';
      const expected = '白日依山尽<br>黄河入海流';
      const res = paragraphText(sample, 'single');
      assert.strictEqual(res, expected);
    });
    it('should return html text and reset to double lineBreaks', () => {
      const sample = '白日依山尽<br />黄河入海流';
      const expected = '白日依山尽<br><br>黄河入海流';
      const res = paragraphText(sample, 'double');
      assert.strictEqual(res, expected);
    });
  });
  describe('isHtml()', () => {
    it('should return false because it is plain text', () => {
      const sample = '我爱北京天安门，天安门上太阳升';
      const res = isHtml(sample);
      const expected = false;
      assert.strictEqual(res, expected);
    });
    it('should return true because it contains <br>', () => {
      const sample = '我爱北京天安门<br>天安门上太阳升';
      const res = isHtml(sample);
      const expected = true;
      assert.strictEqual(res, expected);
    });
    it('should return true because it contains <br />', () => {
      const sample = '我爱北京天安门<br />天安门上太阳升';
      const res = isHtml(sample);
      const expected = true;
      assert.strictEqual(res, expected);
    });
  });
});
