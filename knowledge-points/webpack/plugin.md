# plugin

loader 用于转换某些类型的模块，插件则可用于执行范围更广的任务。包括：打包优化、资源管理、注入环境变量。

plugin 可以钩（hook）到每一个编译（compilation）中发出的关键事件中。在编译的每个阶段中，插件都拥有对 compiler 对象的完全访问能力，并且在合适的时机，还可以访问当前的 compilation 对象。

使用一个插件时，你先要 require()它，然后添加到 plugins 数组中。多数插件可以通过选项（option）自定义。也可以在一个配置文件中因为不同目的多次使用同一个插件，此时需要使用 new 关键字来创建一个插件实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

## plugin 机制

webpack 内部，在 createCompiler 方法中会遍历 plugins 执行插件（webpack/lib/webpack.js）。

执行插件自身或者其原型上的 apply 方法时，插件通常会将一些操作钩（hook）到 compiler 或者 compilation 的特定阶段，然后在 compiler 和 compilation 执行到相应阶段的时候执行插件所定义的操作。

```js
/**
 *  @param {WebpackOptions} rawOptions options object
 * @returns {Compiler} a compiler
 */
const createCompiler = (rawOptions) => {
  const options = getNormalizedWebpackOptions(rawOptions);
  applyWebpackOptionsBaseDefaults(options);
  const compiler = new Compiler(options.context);
  compiler.options = options;
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler);
  // 遍历执行所有插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  // ...
};
```

一个 webpack 插件由以下部分组成：

- 一个命名的 JS 函数或者一个 JS 类

- 原型上定义了 apply 方法

- 指定一个钩子函数使用

- 操作 webpack 内部实例的特定数据

- 功能完成后调用 webpack 提供的回调函数

```js
// 一个 JS 类
class MyPlugin {
  // 定义 apply 作为它的原型方法，入参为 compiler
  apply(compiler) {
    // 以异步方式使用emit钩子
    compiler.hooks.emit.tapAsync('MyFirstPlugin', (compilation, callback) => {
      console.log('this is my first plugin.');
      console.log('compilation:', compilation);
      // 使用 webpack 提供的插件 API 操作 build
      compilation.addModule(/_ ... _/);
      // 调用回调函数
      callback();
    });
  }
}
```

compiler 钩子

https://webpack.docschina.org/api/compiler-hooks/

compilation 钩子

https://webpack.docschina.org/api/compilation-hooks/
