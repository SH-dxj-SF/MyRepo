# 概念

本质上，webpack 是一个用于现代 JavaScript 应用程序的*静态模块打包工具*。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图（dependency graph），然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们全都是静态资源，用于展示你的内容。

核心概念：

- 入口（entry）
- 输出（output）
- loader
- 插件（plugin）
- 模式（mode）
- 浏览器兼容性（browser compatibility）
- 环境（environment）

## 入口（entry）

入口起点（entry point）指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点依赖的（直接和间接）。

默认值为 ./src/index.js，但你可以通过在 webpack.configuration 中配置 entry 属性，来指定一个（或多个）不同的入口起点。例如：

webpack.config.js

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

## 输出（output）

output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是./dist/main.js，其他生成文件默认放置在./dist 文件夹中。

你可以在配置中指定一个 output 字段，来配置这些处理程序：

webpack.config.js

```js
const path = require('path');
// Node.js核心模块，用于操作文件路径

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
};
```

## loader

webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效**模块**，以供应用程序使用，以及被添加到依赖图中。

注意 ⚠️：webpack 一个强大的特性就是能通过 import 导入任何类型的模块（例如.css 文件），其他打包程序或任务执行器

loader 用于对模块的源代码进行转换。loader 可以使你在 import 或“load（加载）”模块时与处理文件。loader 可以将文件从不同的语言（例如 TypeScript）转换为 JavaScript 或者将内联图像转换为 data URL。它甚至可以允许你直接在 JavaScript 模块中 import CSS 文件。

使用 loader 有两种方式：

1. 配置方式（推荐 ✅）：webpack.config.js 中指定 loader
2. 内联方式：在每一个 import 语句中显示指定 loader

### 配置方式

module.rules 允许你在 webpack 中指定多个 loader。loader 从右到左，从下到上的取值（evaluate）/执行（execute）
loader 有两个属性：

- test：识别哪些文件会被转换
- use：定义转换时应该使用哪个 loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
```

上述配置告诉 webpack：如果你碰到 require()、import 语句中被解析为'.css' 的路径时，在你对它打包之前，请先 use（使用）loder 处理一下（从 sass-loader 开始，然后执行 css-loader
、最后以 style-loader 结束）。

### 内联方式

可以在 import 语句和任何与 import 方法同等的引用方式中指定 loader。用 “!”（感叹号） 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过为内联 import 语句添加前缀，可以覆盖配置中的所有 loader、preLoader、postLoader：

- ! 前缀：禁用所有已配置的 normal loader（普通 loader）

```js
import styles from '!style-loader!css-loader?modules!./styles.css'
-
```

!! 前缀：禁用所有的已配置的 loader（loader、preLoader、postLoader）

```js
import styles from '!!style-loader!css-loader?modules!./styles.css'
-
```

-! 前缀：禁用所有已配置的 loader、preLoader，不包括 postLoader

```js
import styles from '-!style-loader!css-loader?modules!./styles.css';
```

### loader 特性

- loader 支持链式调用：链中的每一个 loader
  会将转换应用在已处理过的资源上。一组链式的 loader 按照相反的顺序执行。链中每一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader。最后，链中的最后一个 loader 返回 webpack 所期望的 JavaScript。

- loader 可以是同步的，也可以是异步的。

- loader 可以通过 options 选项来配置

- 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块

- plugin（插件）可以为 loader 带来更多特性

- loader 能够产生额外的任意文件。

### 解析 loader

loader 遵循标准模块解析规则。多数情况下，loader 将从模块路径加载（通常是 npm install， node_modules 进行加载）。

我们预期 loader 模块导出为一个**函数**，并且编写为 Node.js 兼容的 JavaScript。

通常使用 npm 管理 loader，但是也可以将应用程序中的文件作为自定义 loader。

按照约定，loader 通常被命名为 xxx-loader（例如 json-loader）。

### 编写一个 loader

loader 是一个导出一个函数的节点模块。当需要使用该 loader 转换一个资源是，这个方法就会被调用。方法内部可以通过 this 上下文访问到 Loader API。

起始 loader 只有一个入参 source，即资源文件的内容。compiler 预期得到最后一个 loader 产生的处理结果。这个处理结果应该为 String 或者 Buffer（能够被转换为 string）类型，代表了模块的 JavaScript 源码。

...

---

## plugin

loader 用于转换某些类型的模块，插件则可用于执行范围更广的任务。包括：打包优化、资源管理、注入环境变量。

使用一个插件时，你先要 require()它，然后添加到 plugins 数组中。多数插件可以通过选项（option）自定义。也可以在一个配置文件中因为不同目的多次使用同一个插件，此时需要使用 new 关键字来创建一个插件实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
    ],

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
  },
};
```

上面的示例中，html-webpack-plugin 使用我们指定的模版，为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。

## 模式（mode）

通过选择 development、production 或 none 之中的一个，来设置 mode 参数，你可以启用 webpack 内置的相应环境下的优化。默认值为 production。

```js
module.exports = {
  mode: 'production',
};
```

## 浏览器兼容性（browser compatibility）

webpack 支持所有符合 ES5 标准的浏览器（不支持 IE8 及以下版本）。webpack 的 import()和 require.ensure()需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要提前加载 polyfill。

## 环境（environment）

webpack5 运行于 Node.js v10.13.0+的版本
