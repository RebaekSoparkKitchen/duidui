# Duidui

_人的所作所为俨然是语言的构成者和主人，而实际上，语言才是人的主人。 —— 海德格尔 《筑·居·思》_

duidui 是一个中文校对库，致力于将任意中文文本修正为一个企业级规范的文本。其将围绕着这五个模块展开工作：

- 标点符号：何时使用全角符号，何时该使用半角符号?
- 空格：何时该使用空格，中文与英文之间吗？中文与半角符号之间吗？何时不该使用空格呢？首尾的空格是否存在呢？
- 段落：段落之间应该空几行呢，一行 / 两行？
- 大段重复：当你看到大段的重复时，这是否是复制粘贴的遗产呢？
- 广告禁用词：如果恰好你也对营销感兴趣，我们也许不该使用那些不该使用的词语。

上述问题困扰了我许久，当我写完一篇稿子，却迟迟不敢交付，因为我害怕我的格式并不是完全正确的。duidui 就是为了解决以上这些问题而诞生的，接下来我将首先介绍它的基本使用方式，而后对它更正文本的算法进行详细介绍。

## 安装方式

```
yarn add duidui
```

## 快速入门

```javascript
const duidui = require('duidui');

const text = '人,诗意地栖居在 大地上。 ';
const result = duidui.proofread(text);

console.log(result.data);
// 人，诗意地栖居在大地上。

console.log(result.logger);
/* [
  { index: 1, value: ',', replaceValue: '，' },
  { index: 8, value: ' ', replaceValue: '' },
  { index: 13, value: ' ', replaceValue: '' }
] */

console.log(result.checklist);
// { duplicate: [], adKeyWords: [] }
```
