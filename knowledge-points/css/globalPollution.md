# CSS 全局污染问题

1. 书写规范：例如 BEM（Block\_\_Element--Modifie）。但是规范需要人遵守，容易被打破。且不同团队之间规范差异可能会很大

2. CSS modules：打包工具，例如 Webpack 在 user.js 中 import styles from test.css，当 user.js 被使用时将类名通过一定规则（hash）编译成全剧唯一的字符串，然后将 test.css 的内容嵌入到一个新生成的<style\>标签中插入 user.js 中。替代了手工位置命名规范的方式。

   并且 CSS modules 可以和 Less 语法一起使用。

   注意 ⚠️：很多 CSS 选择器 CSS modules 不处理的，比如：body、div、a 这样的 HTML 标签名，所以如果想要定义局部样式/动画，请使用 class 和@keyframes

3. Vue 中 scoped：PostCSS loader 处理带有 scoped 属性的<style\>标签，通过给组件中每一个标签加上一个特定规则生成（hash）的 data 属性，然后将<style\>标签中的选择器加上一层属性选择器。

   注意 ⚠️：应当优先使用 class/id 选择器，因为 scoped 和比如 p 这样的标签一起使用时会慢很多。
   我们看一下转换前后的差别：

   ```html
   <style scoped>
     .example {
       color: red;
     }
   </style>

   <template>
     <div class="example">hi</div>
   </template>
   ```

   转换后的结果

   ```html
   <style scoped>
     .example[data-v-f3f3feg9] {
       color: red;
     }
   </style>

   <template>
     <div class="example" data-v-f3f3feg9>hi</div>
   </template>
   ```

而且一个组件中可以混用全局和本地样式：

```html
<style>
  /* 全局样式 */
</style>

<style scoped>
  /* 本地样式 */
</style>
```
