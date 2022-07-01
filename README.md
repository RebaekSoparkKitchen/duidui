# Duidui

<p align="right"><i>好的文字有着水晶般的光辉，仿佛来自星星。 —— 王小波 《黑铁时代》</i></div>

duidui 是一个中文校对库，致力于将任意中文文本修正为一个企业级规范的文本。其将围绕着这五个模块展开工作：

- 标点符号：何时使用全角符号，何时该使用半角符号?
- 空格：何时该使用空格，中文与英文之间吗？中文与半角符号之间吗？何时不该使用空格呢？首尾的空格是否存在呢？
- 段落：段落之间应该空几行呢，一行 / 两行？
- 大段重复：当你看到大段的重复时，这是否是复制粘贴的遗产呢？
- 广告禁用词：如果恰好你也对营销感兴趣，我们也许不该使用那些不该使用的词语。

上述问题困扰了我许久，当我写完一篇稿子，却迟迟不敢交付，因为我害怕我的格式并不是完全正确的。duidui 就是为了解决以上这些问题而诞生的，接下来我将首先介绍它的基本使用方式，而后对它更正文本的算法进行详细介绍。

## 安装方式

```shell
# yarn
yarn add duidui

# npm
npm install duidui
```

## 快速入门

```javascript
const duidui = require('duidui');

// 如果您在使用 typescript 或者 es6 的 js，使用 import 以获得类型提示
// import duidui from 'duidui';

const text = '人,诗意地栖居在 大地上。 ';
const result = duidui.proofread(text);

console.log(result.data);
// 人，诗意地栖居在大地上。

console.log(result.log);
/* [
  { index: 1, value: ',', replaceValue: '，' },
  { index: 8, value: ' ', replaceValue: '' },
  { index: 13, value: ' ', replaceValue: '' }
] */

console.log(result.checklist);
// { duplicate: [], adKeyWords: [] }
```

## proofread 函数

proofread 函数是 duidui 唯一的 attribute, 也就是说本 library 只提供了一个函数 - proofread<br>它的输入包括两个参数，第一个是被校对文本，第二个是 options;
<br>函数的返回值是一个对象，其中包括 data, log, checklist, 具体说明如下：
| Attribute | 描述 |
| --- | ---|
| data | 已经被修正后的文本<br>段落，标点，空格三项检查在此处体现 |
| log | 描述从输入文本到 data 其中修改的详细记录<br>包括位置，原值以及修改值 |
| checklist | 描述了重复文本以及广告禁用词在输入文本中的位置 |

其中比较特别的，需要继续详细说明一些的是 options 和 checklist, 为接下来两部分的内容。

## Options - 可配置选项

options 是 proofread 函数的第二个参数。

| 选项            | 类型    | 描述                                                                                  | 默认值   |
| --------------- | ------- | ------------------------------------------------------------------------------------- | -------- |
| space           | boolean | 是否执行空格的自动更正                                                                | true     |
| punctuation     | boolean | 是否执行标点符号的自动更正                                                            | true     |
| paragraph       | boolean | 是否执行段落的自动更正                                                                | true     |
| paragraphMargin | string  | 决定段落之间的间隙<br>当且仅当 paragraph 为 true 时生效<br>可选: "single" \| "double" | "double" |
| duplicate       | boolean | 是否执行文本重复检查                                                                  | true     |
| dupThreshold    | number  | 决定重复文本检查最低字符数<br>当且仅当 duplicate 为 true 时生效                       | 5        |
| adKeyWords      | boolean | 是否执行广告禁用词检测                                                                | true     |

### 示例

```javascript
const duidui = require('duidui');

// use case: 我对我的段落划分很自信，不要你管。
const text = '天生我材必有用<br><br><br>千金散尽还复来';
const res1 = duidui.proofread(text);
console.log(res1.data);
// 天生我材必有用<br><br>千金散尽还复来

const res2 = duidui.proofread(text, { paragraph: false });
console.log(res2.data);
// 天生我材必有用<br><br><br>千金散尽还复来
```

## Checklist 说明

Checklist 是一份警告通知，代表着文本中我认为可能有些问题，但我不敢贸然直接更改的部分。<br>它们就是大段重复提示和广告禁用词提示，同样的，接下来的部分我将用两个示例来说明。

### 重复字判定

```javascript
const duidui = require('duidui');
const text =
  '我爱北京，我爱北京天安门，北京天安门上日出很美，所以我爱北京天安门。';
const res = duidui.proofread(text);
console.log(res.checklist);
//  {
//   duplicate: [
//     {
//       value: '北京天安门',
//       indexRanges: [
//         [7, 11],
//         [13, 17],
//         [28, 32],
//       ],
//     },
//     {
//       value: '我爱北京天安门',
//       indexRanges: [
//         [5, 11],
//         [26, 32],
//       ],
//     },
//   ],
//   adKeyWords: [],
// }

const res1 = duidui.proofread(text, { dupThreshold: 7 });
console.log(res1);
// {
//   duplicate: [
//     {
//       value: '我爱北京天安门',
//       indexRanges: [
//         [5, 11],
//         [26, 32],
//       ],
//     },
//   ],
//   adKeyWords: [],
// }
```

这个示例说明两个问题：

1. "爱北京天安门"也是重复字，但它一直出现在"我爱北京天安门"中，所以不予显示。
2. "北京天安门"也是"我爱北京天安门"的子串，但它**不是在每个地方**都与其伴随出现，所以"北京天安门"被单独列出。

希望这个示例能够说清重复字的判定标准。

### 广告禁用词判定

```javascript
const duidui = require('duidui');

const text = '很难相信，这是我用过最好的一款产品！';
const res = duidui.proofread(text);
console.log(res.checklist);

//  {
//   duplicate: [],
//   adKeyWords: [
//     { indexRange: [10, 10], word: '最' },
//     { indexRange: [10, 11], word: '最好' },
//   ],
// }
```

广告禁用词部分，"最"一直搭配"最好"出现，但我认为此处可以同时出现，因为"最好"禁用正是因为这个"最"字。

## 欢迎 PR

最后希望对中文校对感兴趣的朋友们，积极提 Issues, 欢迎 PR!
