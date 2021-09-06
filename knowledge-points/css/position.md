# CSS 定位（position）

position 属性用于指定一个元素在文档中的定位方式。left、right、top、bottom 则决定了元素最终的位置。

## 定位类型

- 定位元素（positioned element）：是其计算后位置属性为：relative、absolute、fixed 或 sticky 的元素（换句话说，除 static 以外的任何东西）。

- 相对定位元素（relatively positioned element）：计算后位置属性为 relative 的元素。

- 绝对定位元素（absolutely positioned element）：计算后位置属性为 absolute、fixed 的元素。

- 粘性定位元素（sticky positioned element）：计算后位置属性为 sticky 的元素。

大多数情况下：height 和 width 被设置为 auto 的**绝对定位元素**，按其内容大小调整尺寸。但是被绝对定位的元素可以通过指定 top、bottom（保留 height 未指定，即 auto），来填充可用的垂直空间。同样的通过指定 left、right（保留 width 未指定，即 auto），来填充可用的水平空间。

注意 ⚠️：除了上述情况（绝对定位元素填充可用空间）：

- 如果 top 和 bottom 都被指定了（严格来说这里的指定值不为 auto），那么 top 优先

- 如果制定了 left 和 right，当 direction 设置为 ltr 时（水平书写的中文，英文等），left 优先；当 direction 设置为 rtl（阿拉伯语、希伯来语、波斯语等由右往左书写）时，right 优先。

## position 取值

- static：该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 left、right、top、bottom、z-index 无效。

- relative（不脱离文档流）：该关键字下，元素先放置到未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（所以会在元素未添加定位时的所在位置留下空白）。

  注意 ⚠️：position：relative 对 table-\*-group、table-row、table-column、table-cell、table-caption 无效。

- absolute（脱离文档流）：元素被移除正常文档流，并不为元素预留空间，而是通过指定元素相对于**最近**的**非 static** 定位祖先元素的偏移，来指定位置。绝对定位的元素可设置外边距（margins），且不会与其他边距合并。

- fixed（脱离文档流）：元素被移除正常文档流，并不为元素预留空间，通过相对于屏幕视口（viewport）的位置来指定元素位置（元素的位置在屏幕滚动时不会改变；打印时元素会出现在每页的固定位置）。fixed 会创建新的层叠上下文。当元素祖先的 transform、perspective 或 filter 属性非（none、0）时，容器由视口改为该祖先。

- sticky：元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block（最近块级祖先：nearest block-level ancestor），包括 table-related 元素，基于 top、left、top、bottom 值进行偏移（偏移值不会影响任何其他元素的位置）。该值总是新出创建一个新的层叠上下文，一个 sticky 元素会“固定”在离它最近的具有“滚动机制”的祖先上（当该祖先的 overflow 属性为 hidden、scroll、auto、overlay）。即便该祖先不是最近的真实可滚动祖先。这有效的抑制了任何“sticky”行为。

## sticky（粘性）定位，用于定位字母列表的头部元素

dl 相当于包含块（containing block），当包含块被滚出时，将 sticky 元素带走。实现下一个将上一个“顶走”的效果（否则多个粘性元素是重叠在一起的）

```html
<div>
  <dl>
    <dt style={'position: sticky; top: 0;'}>A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl>
    <dt style={'position: sticky; top: 0;'}>C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl>
    <dt style={'position: sticky; top: 0;'}>E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl>
    <dt style={'position: sticky; top: 0;'}>T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>
```

## 绝对定位元素实现水平垂直居中

1. 利用 margin-left、margin-top，需知道自身宽高

```css
position: absolute;
left: 50%;
top: 50%;
margin-left: '-(自身宽度/2)';
margin-top: '-(自身高度/2)';
```

2. 利用 transform，需要 IE8 以上

```css
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
```

3. 利用绝对定位元素自适应的特点：

```css
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
margin: auto;
width: '固定';
height: '固定';
```

原理：水平方向：width(包含块) = margin(自身) + width(自身) + padding(自身) + left(自身) + right(自身)，绝对定位包含块为最近非 static 定位祖先元素的内边距边缘组成。垂直方向有类似计算关系。

所以绝对定位元素布局由三个因素决定（位置：left、right、top、bottom；尺寸：width、height；边距：padding、margin）。

因为 padding 属性无 auto 值。所以使用 margin 属性配合：

- 位置尺寸固定--->自适应 margin
- 位置；margin 固定--->自适应尺寸。

## 非绝对定位实现水平垂直居中

1. flex 布局：justify-content 配合 align-items
2. grid 布局：justify-content、align-content、justify-items、align-items，实现方式比较灵活
