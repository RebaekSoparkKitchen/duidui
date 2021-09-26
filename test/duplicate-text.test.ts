import chai = require('chai');
const assert = chai.assert;
import {
  searchDuplicates,
  longerHash,
  filterDominatedWords,
} from '../src/duplicate-text';

describe('duplicate-text', () => {
  describe('searchDuplicates()', () => {
    it('should return something', () => {
      const sample = `他爱你吧，我爱你呀啊  ，你说呢，我说我爱你呀。哈哈嘿嘿，我爱你吧`;
      const sample1 = `太阳出来我爬山坡，爬到了山顶我想唱歌。 太阳出来我爬山坡，爬到了山顶我想唱歌。`;
      //我爱 爱你永远关联出现
      const res1 = searchDuplicates(sample1, 5);
      const expected1: any = [
        {
          '太阳出来我爬山坡，爬到了山顶我想唱歌。': [
            [0, 18],
            [20, 38],
          ],
        },
      ];
      assert.deepEqual(res1, expected1);

      //   const res = searchDuplicates(sample, 2);
      //   const res2 = longerHash(sample, res);
      //   const filtered = filterDominatedWords(res, res2);
      //   console.log(res);
      //   console.log(res2);
      //   console.log(filtered);
    });
  });
});
