# 媒体查询（Media queries）

通过媒体查询，可以根据各种设备特征和参数的值或者是否存在来调整我们的网站或应用。

它们是**响应式设计**的关键组成部分。例如：媒体查询可以缩小小型设备上的字体大小；在纵向模式下查看页面时增加段落之间的填充；或者增加触摸屏上按钮的大小。

在 css 中使用"@media at-rule" 根据媒体查询结果有条件的应用样式表的一部分。使用@import 有条件的应用整个样式表。

## 在 HTML 中使用媒体查询

在 HTML 中，媒体查询可应用于各种元素：

1. 在<link\>元素的 media 属性，它们定义了待应用链接资源（通常为 css）的媒体。

2. 在<source\>元素的 media 属性中，它们定义了待应用源的媒体。（仅在 picture 元素内有效）

3. 在<style\>元素的 media 属性中，它们定义了待应用样式的媒体。

## 在 JavaScript 中是有媒体查询

在 JS 中你可以使用 window.matchMedia()方法根据媒体查询测试窗口。还可以使用 MediaQueryList.addListener()在查询状态发生变化时收到通知。借助此功能，你的站点或应用可以响应应用设备配置、方向或状态的改变。

## CSS 中

> 更多规则信息请查看 https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media

响应式布局几个关键的设备分辨率：480 576 640 768 992 1200 1600

采用 min-width 写法：小的写在上边

```css
/* >= 768px 的设备 */
@media screen and (min-width: 768px) {
  .container {
    /* 样式 */
  }
}
/* >= 992px 的设备 */
@media screen and (min-width: 992px) {
  .container {
    /* 样式 */
  }
}
/* >= 1200px 的设备 */
@media screen and (min-width: 1200px) {
  .container {
    /* 样式 */
  }
}
```

采用 max-width 写法：大的在上边

```css
/* <= 1199px 的设备 */
@media screen and (max-width: 1199px) {
  .container {
    /* 样式 */
  }
}
/* <= 991px 的设备 */
@media screen and (max-width: 991px) {
  .container {
    /* 样式 */
  }
}
/* <= 767px 的设备 */
@media screen and (max-width: 767px) {
  .container {
    /* 样式 */
  }
}
```
