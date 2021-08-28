# 经典脚本（classic scripts）&模块脚本（module scripts）

JavaScript 两种源文件（Source File）：

- 经典脚本：通常也直接叫脚本
- 模块脚本：通常也直接叫模块

JavaScript 执行的东西：

- 经典脚本
- 模块脚本
- 函数

ES5 以前只有一种源文件：经典脚本，可以被浏览器或者 node 环境引入执行（也可以使用 C++、Java 调用 JS 引擎）。而模块只能由 JS 代码 import 引入执行。

大致可以理解为经典脚本是主动性的 JS 代码段，控制宿主完成一定任务。模块脚本是被动性的 JS 代码段，等待被调用的库。没有 import 引入就不会被执行。

他们之间一个主要区别在于代码中是否包含 import 和 export。

现代浏览器支持使用\<script>标签引入经典脚本和模块脚本，引入模块脚本需要这样：

```js
<script type="module" src="some/module/test.js"></script>
```

引入经典脚本去掉 type=“module”即可，如果引入模块脚本丢失 type=“module”则会抛错。
