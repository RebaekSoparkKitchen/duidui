import chai = require('chai');
const assert = chai.assert;
import { norm, paragraphText } from '../src/paragraph';

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
    const sample = `白日依山尽
		  
		 黄河入海流
		 
		 `;
    it('should return plain text', () => {
      const expected = '白日依山尽\n黄河入海流';
      const res = paragraphText(sample, 'plain', 'single');
      assert.strictEqual(res, expected);
    });
    it('should return html text', () => {
      const expected = '白日依山尽<br>黄河入海流';
      const res = paragraphText(sample, 'html', 'single');
      assert.strictEqual(res, expected);
    });
    it('should return double lineBreaks', () => {
      const expected = '白日依山尽<br><br>黄河入海流';
      const res = paragraphText(sample, 'html', 'double');
      assert.strictEqual(res, expected);
    });
  });
});
