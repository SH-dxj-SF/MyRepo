# CSS 视觉格式化模型

CSS 视觉格式化模型（visual formatting model）描述了在视觉媒体上，用户代理（user agents）如何获取文档树，以及如何处理和展示文档树。
在视觉格式化模型中，文档中的每一个元素都会根据**盒模型**生成零个或多个盒子，这些盒子的布局由以下因素控制：

- 盒子的尺寸：精确指定、约束条件指定、没有指定

- 盒子的类型：行内盒子（inline）、行内级盒子（inline-level）、原子行内级盒子（atomic
  inline-level）、块盒子（block）

- 定位方案：普通流定位、浮动定位、绝对定位

- 文档树中元素之间的关系：兄弟、父子

- 外部因素：视窗尺寸，图片固有的尺寸

# CSS 基础框盒模型

CSS 框盒模型是 CSS 规范的一个模块，它定义了一个长方形（矩形）盒子，包括它们各自的内容区（content）、内边距（padding）、边框（border）和外边距（margin），并根据**视觉格式化模型**来生成元素，对其进行布置、布局、编排（layout）。常被译为**盒子模型**、**盒模型**或**框模型**。

CSS 框盒模型一般仅针对单个元素及其边距、内容进行排布，而非对多个元素进行综合的排版，即使**外边距合并**等特性涉及两个或两个以上元素之间部分属性的交互反馈。

## 属性

- 控制框盒中内容流的属性：overflow、overflow-x、overflow-y

- 控制框盒大小的属性：height、max-height、min-height、width、max-width、min-width

- 控制外边距的属性：margin、margin-top、margin-right、margin-bottom、margin-left、margin-trim（🧪 实验）

- 控制内边距的属性：padding、padding-top、padding-right、padding-bottom、padding-left

- 其他属性：visibility

![baseBoxModel](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/baseBoxModel.png)

## 标准盒模型

标准盒模型中设置 width、height 其实设置的只是**内容区（content box）** 的宽高，内边距（padding）和边框（border）再加上设置的 width、height 才是整个盒子的大小。

![contentBoxModel](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/contentBoxModel.png)

注意 ⚠️：margin 不计入实际大小，当然，它会影响盒子在页面所占空间，但是它影响的是盒子外部的空间。盒子的范围到边框为止。
如下图所示：

## 替代盒模型

你可能会认为盒子的实际大小还要加上 padding 和 border，会很麻烦。所以 CSS 在推出标准盒模型后不久，推出了另一种替代盒模型（alternative box model）。使用此模型，定义的宽高就是盒子**实际的宽高**，内容区的宽高等于定义的宽高减去内边距盒边框。

![borderBoxModel](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/borderBoxModel.png)

浏览器默认使用标准盒模型，如果想使用替代盒模型，可以通过设置 **box-sizing 属性**值为 border-box 实现，该属性默认为 content-box。

注：IE 默认使用替代盒模型，没有可用的转换机制（IE8+支持 box-sizing 转换）

## 块级盒子（block box）&行内（内联）盒子（inline box）

块级盒子盒行内盒子是我们使用最广泛的两种“盒子”，这两种盒子在**页面流（page flow）** 和**元素之间的关系**方面表现出不同行为：

**块级（block）盒子**：

- 每个盒子换到新的一行

- 盒子会在行内方向上扩展并占据父容器在该方向上的所有可用空间，绝大多情况下意味着元素会和父容器一样宽，填满 100%的可用空间。

- width 和 height 属性**可以生效**

- 内边距（padding）、外边距（margin）、边框（border）会将其他元素从盒子周围“推开”

**行内（inline）盒子**：

- 盒子不会换行

- width 和 height 属性**不会生效**

- **垂直方向**上的内边距（padding）、外边距（margin）、边框（border）都会被应用，但是**不会**把其他处于 inline 状态的盒子推开。

- **水平方向**上的内边距（padding）、外边距（margin）、边框（border）都会被应用，并且**会**把其他处于 inline 状态的盒子推开。

## 外边距折叠

块的上外边距（margin-top）和下外边距（margin-bottom）有时会重叠（合并）为单个边距，其值为单个边距较大的一个（相等则为其中一个），这种行为（现象，特性）被成为外边距折叠。

注意 ⚠️：该行为都是发生在块级元素（block-level）， **浮动元素**和**绝对定位元素**不会产生外边折叠。

有三种情况会产生外边距折叠：

- 相邻兄弟元素之间的外边距

- 没有内容将父元素和后代元素分开：

  - 没有边框（border）、内边距（padding）、行内内容，也没有创建**块格式化上下文**或清除浮动来分开一个块级元素的上边距 margin-top 与其内一个或多个后代块级元素的上边距 margin-top；

  - 没有边框（border）、内边距（padding）、行内内容、高度（height）、最小高度（min-height）或最大高度（max-height）来分开一个块级元素的下边距 margin-bottom 与其内的一个或多个后代块元素的下边距 margin-bottom。

  上述两种情况就会出现父块元素和后代块元素的外边距重叠，重叠部分会溢出到父块元素外。

- 空的块级元素：没有边框（border）、内边距（padding）、行内内容、高度（height）、最小高度（min-height），该块元素的上下外边距重叠。

一些注意点：

1. 上述情况的组合会产生更复杂的外边距折叠情况。

2. 即使某一个外边距为 0，这些规则仍然适用。因此就算父元素的外边距为 0，后代元素（第一个、最后一个）的外边距还是会溢出到父元素外。

3. 如果参与外边距折叠的的值中包含负值，那么折叠后的外边距为最大的外边距与最小的外边距（绝对值最大的负值）的和。比如说：-12px、8px、32px 为例，折叠后的外边距为 20px（32 px – 12px）。

4. 如果参与折叠的外边距全都是负值，那么外边距值为最小的外边距（绝对值最大的负值）。该规则适用于相邻和嵌套元素。
