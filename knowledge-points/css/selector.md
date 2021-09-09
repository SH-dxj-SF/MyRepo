# CSS 选择器

## 基础选择器

### 通用选择器（通配选择器）

选择所有元素，可以和命名空间组合使用：

- ns|\*: 会匹配 ns 命名空间下的所有元素
- \*|\*: 会匹配所有命名空间下的所有元素
- |\*: 会匹配所有没有命名空间的元素

```css
/* 选择所有元素 */
* {
  color: green;
}
```

### 类型选择器 （标签选择器、元素选择器）

按照给定的节点名称，选择所有匹配的元素。

a, span, div, p...

```css
/* 选择所有<a>标签*/
a {
  color: red;
}
```

### 类选择器

按照给定的 class 属性的值，选择所有匹配的元素。

.class_name { style properties }

```css
/*_* 所有带有 class="test"的元素 *_*/
.test {
  margin: 8px;
}
```

### ID 选择器

按照 id 属性选择一个与之匹配的元素。需要注意的是，一个文档中，每个 ID 属性都应当是唯一的。

#idname

```css
/* 所有带有 id="test"的元素 */
#test {
  border: red 2px solid;
}
```

### 属性选择器

按照给定的属性，选择所有匹配的元素。

- [attr]

  表示带有以 attr 命名的属性的元素。

- [attr=value]

  表示带有以 attr 命名的属性，且属性值为 value 的元素。

- [attr~=value]

  表示带有以 attr 命名的属性的元素，并且该属性是一个以空格作为分隔的值列表，其中至少有一个值为 value。

- ...

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors

```css
/* 存在 title 属性的<a> 元素 */
a[title] {
  color: purple;
}
```

## 组合器（关系选择器）

### 后代元素选择器

A␣B（‘␣’代表一个或多个空白字符）

选择前一个元素的**后代**节点

```css
/*_* div 的 span 后代会被选中 *_*/
div span {
  background-color: blue;
}
```

### 直接子元素选择器

A > B

选择前一个元素的直接子代的节点。

```css
/* div 的直接 span 后代(子)会被选中 */
div > span {
  background-color: blue;
}
```

### 一般兄弟元素选择器

A ~ B

后一个节点在前一个节点后面的任意位置，并且共享同一个父节点。

```css
/* p 和 span 同级，p 标签后面的 span 标签将被选中 */
p ~ span {
  color: red;
}
```

### 紧邻(相邻)兄弟元素选择器

A + B

后一个元素紧跟在前一个之后，并且共享同一个父节点。

```css
/* span 和 a 同级，span 标签后面紧跟着的 a 标签将被选中 */
span + a {
  font-style: bold;
}
```

## 伪选择器

### 伪类（状态选择器）

hover, first, nth-child()...

添加到选择器的关键字，指定要选择的元素的特殊状态。

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes

```css
/* 所有指针悬停的按钮 */
button:hover {
  color: blue;
}
```

注意 ⚠️：a 标签四个伪类（状态）书写顺序：L-V-H-A，由于四个权重相同，后写的会覆盖前面的。

```css
a:link {
}
a:visited {
}
a:hover {
}
a:active {
}
```

### 伪元素

before, after...

用于表示无法用 HTML 语义表达的实体。一个选择器中只能使用一个伪元素。伪元素必须紧跟在语句中的简单选择器/基础选择器之后。

```css
/* 每一个 <p> 元素的第一行。 */
p::first-line {
  color: blue;
  text-transform: uppercase;
}
/* 为每一个<p>元素创建一个伪元素，作为最后一个子元素，默认为行内元素 */
p::after {
  content: blue;
  color: blue;
}
```

# 选择器权重

| 选择器                                      | 权重值   |
| ------------------------------------------- | -------- |
| !important（非选择器，尽量避免）            | infinity |
| 内联样式（非选择器）                        | 1000     |
| ID: #example                                | 0100     |
| 类.example; 属性[type=”radio”]; 伪类:hover  | 0010     |
| 标签 h1; 伪元素::before                     | 0001     |
| 通配 \*; 关系选择符 ␣ > ~ +; 否定伪类:not() | 0000     |

注意 ⚠️ 相同优先级，后边的覆盖前边的。:not()内声明的选择器会影响优先级

## 什么情况下可以使用 !important

- 覆盖内敛样式：你的网站上有一个设定全站样式的 CSS 文件，同时其他人又写了一些很差的内联样式。
- 覆盖优先级高的选择器

## 如何覆盖 !important

- 再添加一条带 !important 的 CSS 规则，同时给这个选择器更高的优先级（多加一个 id、class、tag 等）
- 使用相同的选择器但是置于要覆盖的规则之后
- 重写原来的规则，避免使用 !important
