# CSS 包含块（containing block）

一个元素的尺寸和位置常常受其包含块（containing block）的影响。大多数情况下，包含块就是这个元素**最近祖先块元素**的**内容区**，但也不总是这样。

客户端代理（比如说浏览器），展示文档的时候，对于每一个元素，它都产生了一个盒子。每一个盒子被划分为四个区域：

- 内容区
- 内边距区
- 外边距区
- 边框区

![baseBoxModel](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/baseBoxModel.png)

## 包含块的影响

元素的尺寸、位置常常受其包含块的影响。对于一些属性，比如：width、height、padding、margin、绝对定位元素（比如 position 为 absolute 和 fixed）的偏移值。当我们对其赋予百分比值时，这些值的计算值，就是通过包含块计算得来。

## 确定包含块

确定一个元素的包含块的过程完全依赖于这个元素的 position 属性：

1. position 为 **static、relative、sticky**：包含块由它的**最近**的**祖先块（block）元素**的**内容区**的边缘组成（比如 inline-block、block、list-item），或者建立格式化上下文（比如一个 table container、flex container、grid container、或者 block container 自身）。

2. position 为 **absolute**：包含块就由它**最近**的**非 static** 定位（即 relative、absolute、fixed、sticky 定位）祖先元素的内边距区的边缘组成。

3. position 为 **fixed**：在连续媒体的情况下，包含块是**视口（viewport）**；在分页媒体情况下，包含块是分页区域。

4. position 为 **fixed 或 absolute**：包含块也可能由满足以下条件的**最近祖先元素**的**内边距区**边缘组成：

   - transform 或 perspective 值不为 none
   - will-change 值为 transform 或者 perspective
   - filter 的值不为 none 或者 will-change 值为 filter（仅 Firefox 下有效）
   - contain 的值为 paint

   注意 ⚠️：根元素<html\>所在的包含块是一个被称为**初始包含块**的矩形。它的尺寸是视口 viewport（for continuous media）或分页媒体 page media（for paged media）。

## 根据包含块计算百分值

如上所述，某些属性被赋予百分比值的话，它的计算值是由其包含块计算而来的。这些属性包括盒模型属性和偏移属性：

1. 计算 height、top、bottom 中的百分比值：通过包含块的 height 值计算。如果包含块的 height 会根据其内容变化，而且包含块的 position 属性被置为 relative 或 static，那么这些计算值为 auto。

2. 计算 width、left、right、padding、margin 这些属性：通过包含块的 width 属性来计算它的百分比值。
