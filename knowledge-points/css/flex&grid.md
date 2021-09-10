# 弹性布局（flex）

我们把一个容器的 display 属性设置为 flex 或者 inline-flex 以后，容器中的直系子元素就会变成 flex 元素。所有 css 属性都会有一个初始值，所以 flex 容器和其中的 flex 元素会有一下特征：

- 元素列为一行（flex 容器的 flex-direction 属性初始值为 row）
- 元素从主轴的起始线开始（flex 容器的 justify-content 属性初始值为 flex-start）
- 元素不会在主维度方向拉伸，但是可以缩小（无法再缩小时将溢出）
- 元素被拉伸来填充交叉轴大小（flex 容器的 align-items 属性初始值为 stretch）
- flex-basis 属性为 auto
- flex-wrap 属性为 nowrap（flex 容器的属性）

## 简写属性 flex-flow

是 flex-direction 和 flex-wrap 的简写，第一个值指定为 flex-direction 第二个值指定为 flex-wrap

```css
.test {
  display: flex;
  flex-flow: row wrap;
}
```

## flex 元素上的属性

为了更好地控制 flex 元素，有三个属性可以作用在它们上：

- flex-grow：可用空间（剩余）分配比例
- flex- shrink：溢出时元素的收缩比例（收缩时会考虑元素的最小尺寸）
- flex-basis：定义该元素的空间大小

**简写属性 flex**

是 flex-grow、flex-shrink、flex-basis 的简写，第一值对应 flex-grow，第二个对应 flex-shrink，第三个对应 flex-basis。

```css
/* 语法 */
.test {
  flex: 'flex-grow' 'flex-shrink' 'flex-basis';
}

.test {
  flex: 1;
  /* 等价于 */
  flex: 1 1 0%。;
}
```

注意 ⚠️：元素之间的 flex-grow 和 flex-shrink 是比较**比值关系**，和数值具体大小无关系。

## flex 属性的几种预定义简写形式：

1. flex: initial：相当于 flex: 0 1 auto，flex 元素可压缩不可伸展

2. flex: auto：相当于 flex: 1 1 auto，flex 元素可压缩可伸展

3. flex: none：相当于 flex: 0 0 auto，flex 元素不可压缩也不可伸展

4. flex: <positive-number\>：相当于 flex: <positive-number\> 1 0;

注意 ⚠️：

- flex-grow 为 0 意味着元素不会超过它们的 flex-basis 的尺寸；
- flex-shrink 为 1 意味着会缩小 flex 元素来防止溢出；
- flex-basis 为 auto，意味着它的尺寸可以是主维度上设置的，也可以是根据内容自动得到的。

## align-items

将子元素的 align-self 设置为一个组。flex 元素在交叉轴（辅轴）方向上的对齐方式。初始值为 stretch，这就是为什么 flex 元素会默认被拉伸到最高元素的高度。实际上，它们是被拉伸来填满 flex 容器——最高的元素定义了容器的高度。

- stretch：拉伸
- flex-start：按 flex 容器的顶部对齐
- flex-end：按 flex 容器的下部对齐
- center：居中对齐

注意 ⚠️：顶部和下部受主轴（flex-direction 属性）方向影响，当主轴是水平方向（row 或者 row- reverse）顶部为上，底部为下；当主轴是垂直方向（column 或者 column-reverse）顶部为左，底部为右。

## justify-content

flex 元素在主轴方向上的对齐方式。初始值为 flex-start，flex 元素默认从主轴的起始线排列。常用值：

- stretch：拉伸
- flex-start：从 flex 容器主轴的起始线排列
- flex-end：从 flex 容器主轴的终点线牌系列
- center：在中间排列

- space-between：每行上均匀分配 flex 元素，相邻元素间距相同，第一个元素和起始线对齐，最后一个和终点线对齐。

![space-between](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/flex/space-between.png)

- space-around：每行上均匀分配 flex 元素，相邻元素间距相同。第一个元素和起始线以及最后一个和终点线的间距等于，相邻元素间距的一半。

![space-around](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/flex/space-around.png)

- space-evenly：每行上均匀分配 flex 元素，相邻元素间距相同。第一个元素和起始线的间距以及最后一个和终点线的间距等于相邻元素间距。

![space-evenly](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/flex/space-evenly.png)

# 网格布局（grid）

> https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout

网格布局擅长将一个页面划分为几个主要的区域，以及定义这些区域的大小、位置、层次等关系。与弹性布局有一定相似性，但是比弹性布局强大得多。flex 就像是一维的轴线布局，而网格通过行列产生单元格，是二维的面布局。

像表格一样，我们可以通过行和列来对齐元素，

## 网格容器

通过在元素上声明 display 属性为 grid 或者 inline-grid 来创建一个网格容器。一旦我们这样做，那么所有的直接子元素都会成为网格元素。

## 网格轨道

我们通过 grid-template-columns 和 grid-template-rows 定义网格中的列和行。他们定义了网格轨道。一个网格轨道就是网格中任意两条线之间的空间。

![grid-track](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-track.png)

高亮部分就是第一个行轨道。

下列代码我们定义了网格，包含三个 200 像素宽度的列轨道。子元素将在网格上每个网格单元中展开。

```css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
}
```

## fr（fraction）单位

轨道可以用任何长度单位定义，网格同时引入了一种特殊的长度单位来帮我们创建灵活的网格轨道。fr 代表网格容器中可用空间的一个等分。

下边我们使用 fr 单位，创建三个宽度相等的列轨道。这些轨道可以随着可用空间伸展和收缩。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

也可以固定部分轨道宽度：我们固定了第一列的宽度为 100px，这固定的 100px 被从可用空间拿走，剩余的可用空间按照 2:1 的比例分配给第二、第三列。

```css
.container {
  display: grid;
  grid-template-columns: 100px 2fr 1fr;
}
```

## repeat()

有着多轨道的大型网格，我们可以使用 repeat 来标记部分或者整个轨道列表。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.container {
  display: grid;
  grid-template-columns: 24px repeat(3, 1fr) 24px;
}
```

## 隐式和显示网格

上述例子中我们使用 grid-template-columns 明确地定义了列轨道，但是网格也自己创建了行。显示网格包含了使用 grid-template-columns 和 grid-template-rows 定义的行和列。

如果你在定义的网格之外放置了一些东西，或者因为内容的数量需要更多的网格轨道，那么网格将会在隐式网格中自动创建行和列。默认情况下，这些轨道会自动定义尺寸，尺寸基于里边的内容来调整。

下边我们使用 **grid-auto-rows** 属性，来确保在隐式网格中创建的轨道高度为 200px。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
}
```

## 轨道大小和 minmax()

在设置一个显示的网格，或者定义自动创建的行和列的大小时，我们可能会想给轨道一个最小的尺寸，但也要确保它们扩展以适应添加的任何内容。比如，我需要将行的高度设置到最小 100px，并且如果内容伸展到了 300px 时希望行轨道高度能伸展到 300px。

网格通过 minmax 函数来处理此类问题：我们将 minmax 函数设置为 **grid-auto-rows** 的值，最小行高 100px，最大 auto。auto 意味着行的尺寸会根据内容的大小来变换，根据行中最高的元素来扩展。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
}
```

![auto-track-size-with-minmax](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/auto-track-size-with-minmax.png)

## 网格线

我们定义网格时，定义的是网格轨道，而不是网格线。Grid 会帮我们创建带编号网格线来帮我们定位每一个网格元素。m 行 n 列会产生 m \* n 个单元格，m + 1 条横向网格线，n + 1 条纵向网格线。

例如下面两行，三列的网格中，会拥有四条纵向的网格线：

![grid-line](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-line.png)

同样，网格线的编号顺序依赖于文档的书写模式。比如纵向网格线：如果是从左到右的，1 号在最左边；如果是从右到左的，那么 1 号线在最左边。而且网格线是**可以被命名**的。

## 跨轨道放置网格元素

我们可以使用 grid-column-start、grid-column-end、grid-row-start、grid-row-end 属性来放置网格元素。

```html
<div class="container">
  <div class="box1">One</div>
  <div class="box2">Two</div>
  <div class="box3">Three</div>
  <div class="box4">Four</div>
  <div class="box5">Five</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
}

.box1 {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}

.box2 {
  grid-column-start: 1;
  grid-row-start: 3;
  grid-row-end: 5;
}
```

上述代码，我们将 box1 从列线 1 延伸到列线 4，行线 1 延伸到行线 3，即 box1 占据两行三列。将 box2 从列线 1 延伸到列线 2（不指定结束位置，默认占据一个轨道单位），从行线 3 延伸到行线 5，即 box2 占据两行一列。其余子元素自动分配到剩余网格空间中，默认占据一行一列。

![place-elements-cross-tracks](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/place-elements-cross-tracks.png)

## 网格单元

是网格中最小的单位，概念上来说，它和表格的一个单元格很像。一旦一个网格元素被定义，那么它其中的子元素会排列在每一个事先定义好的网格单元中。

![grid-cell](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-cell.png)

## 网格区域

网格元素可以沿着行或列的方向扩展一个或多个单元，并创建一个网格区域。
这个区域应该是一个矩形，也就是说不可能创建出一个“L”型的网格区域

![grid-area](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-area.png)

## 网格间距

使用 grid-column-gap(最新使用 column-gap)和 grid-row-gap(最新使用 row-gap)定义列、行之间的间距。

grid-gap(最新使用 gap)为简写属性（即：row-gap column-gap）。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 10px;
}
/* 等价于 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px 20px;
}
```

![grid-gap](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-gap.png)

## 嵌套网格

一个网格项也可以成为网格容器。下边的例子中，我们先定义了一个有三列的网格，且有两个跨轨道的网格项。第一个网格项中有几个子元素，他们不是网格容器的直接子元素。所以不参与到网格布局中，显示为正常文档流。

```html
<div class="container">
  <div class="box box1">
    <div class="nested">a</div>
    <div class="nested">b</div>
    <div class="nested">c</div>
  </div>
  <div class="box box2">Two</div>
  <div class="box box3">Three</div>
  <div class="box box4">Four</div>
  <div class="box box5">Five</div>
</div>
```

效果图大致如下：

![nested-grid1](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/nested-grid1.png)

当我们把 box1 的 display 属性置为 grid 并定义轨道，那么它也就成为了一个新的网格。它的子元素也会排列在这个新的网格中。

注意：下边例子我们取消了 box2 的跨轨道属性。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
}

.box1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

![nested-grid2](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/nested-grid2.png)

## 子网格

在 Grid level2 的工作草案中，subgrid 允许我们创建一个使用父网格轨道定义的子网格。目前有且仅有 Firefox71，支持了该功能。2021.06.03

```css
.box1 {
  display: grid;
  grid-template-columns: subgrid; /* 我们修改了这里 */
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

## 使用 z-index 控制层级

网格项可以占据同一个网格单元，我们回到例子，将 box2 的的行线调整一下，使得 box1 和 box2 重叠了。

```html
<div class="container">
  <div class="box box1"></div>
  <div class="box box2">Two</div>
  <div class="box box3">Three</div>
  <div class="box box4">Four</div>
  <div class="box box5">Five</div>
</div>
```

```css
container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
}
.box1 {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}
.box2 {
  grid-column-start: 1;
  grid-row-start: 2; /* 修改了这 */
  grid-row-end: 4; /* 修改了这 */
}
```

![grid-cell-level1](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-cell-level1.png)

我们可以看到 box2 在 box1 上，这个顺序是按照文档原始顺序来的，**后写的在上边**。

**控制顺序**

当然我们可以使用 z-index 属性设置元素的层级，属性值大的会覆盖属性值小的元素。

```css
.test-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
}

.box1 {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
  z-index: 2; /* 新增 */
}

.box2 {
  grid-column-start: 1;
  grid-row-start: 2;
  grid-row-end: 4;
  z-index: 1; /* 新增 */
}
```

![grid-cell-level2](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-cell-level2.png)

# 弹性布局和网格布局

主要区别在于，弹性布局（flex）是为一维布局（沿横向或者纵向）服务的。而网格布局（grid）是为二维布局（同时沿横向和纵向）服务。

## 一维 vs 二维

flex：超出换行后，对齐可能出现问题

![flex-wrapped](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/flex/flex-wrapped.png)

grid：使用网格进行对齐

![grid-wrapped](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/css/grid/grid-wrapped.png)

我们选择 flex 还是 grid 时主要看以下问题：

- 只需要控制行或者列控制布局 => flex
- 同时需要行和列控制布局 => grid

# 对齐属性

- **justify-content**：定义浏览器如何沿着 flex 容器**主轴**和 grid 容器的**行内轴**的元素之间和周围如何分配空间。

- **justify-items**：定义盒子中所有子项默认的 justify-self 属性，使这些子项以默认方式沿适当轴对其到每个盒子。

  该属性的的作用效果取决于我们采用的布局方式：

  - 块级布局中：将其包含的项目在其行内轴行对齐

  - 绝对定位元素中：将其包含的项目在其行内轴上对齐，同时考虑 top、right、bottom、left 的值

  - 表格元素中：被忽略

  - 弹性盒子布局中：被忽略

  - 网格布局中：将栅格区域内的项目在其行内轴上对齐。

- **justify-self**：和 justify-items 作用一致，只不过该属性定义在容器子项目上。

- **align-content**：定义浏览器如何沿着 flex 容器交叉轴和 grid 容器的纵轴的元素之间和周围如何分配空间。注意 ⚠️：该属性对单行弹性布局无效（比如将 flex-wrap 属性设置为 nowrap）

- **align-items**：定义盒子中所有直接子项默认的 align-self 属性。目前弹性布局和网格布局支持此属性。弹性布局中控制**交叉轴**上的对齐方式，网格布局中控制栅格区域内**纵轴**方向上的对齐方式。

- **align-self**：覆盖弹性布局或者网格布局的 align-items 属性，不适用于块级盒子和表格单元。
  注意 ⚠️：如果弹性布局交叉轴或者网格布局栅格区域纵轴方向上 margin 为 auto，那么该属性会被忽略。

- **place-content**：align-content 和 justify-content 的简写属性

- **place-items**：align-items 和 justify-items 的简写属性
