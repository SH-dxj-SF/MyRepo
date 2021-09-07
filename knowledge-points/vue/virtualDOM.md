# 虚拟 DOM

## Vue 中的虚拟 DOM

### 虚拟 DOM 简介

什么是虚拟 DOM？=> 描述 DOM 的 JS 对象

#### 为什么要有虚拟 DOM？

浏览器的 DOM 设计复杂 -> 操作 DOM 耗性能。Vue 是数据驱动视图的，数据变化视图就得更新 -> 更新视图就得操作 DOM -> 只能尽可能少的操作 DOM。

所以通过虚拟 DOM,数据变化我们就比较前后的虚拟 DOM 变化，利用 DOM-Diff 算法计算出需要更新的地方，然后我们再去操作 DOM 更新视图。这也是产生原因及最大用途。

### Vue 中的虚拟 DOM

#### VNode 类(src/core/vdom/vnode.js)

VNode 包含了描述一个真实 DOM 的属性，包括 tag,data,text,children,elm 等等。

#### VNode 的类型

1. 注释节点: 仅需两个属性 text，isComment(为 true)

2. 文本节点: 仅需一个属性 text

3. 克隆节点: 比原节点多一个 isCloned(为 true)属性

4. 元素节点: 更贴近真实的 DOM 节点，描述标签的 tag 属性；描述节点属性的 class、attributes 等 data 属性；描述子节点信息的 children 属性等。

5. 组件节点: 比元素节点多两个属性，componentOptions(组件的 option 选项，如 props)；componentInstance(当前组件对应的 Vue 实例)。

6. 函数式组件节点: 比组件节点又多两个属性，fnContext(当前组件对应的 Vue 实例)，fnOptions(组件的 option 选项)。

以上就是 VNode 可描述的节点类型，它们都是 VNode 的实例实例化参数不同而已。

#### VNode 的作用

视图渲染前将模版编译成 VNode 并缓存 -> 数据变化需要重新渲染的时候，将变化后新生成的 VNode 与之前缓存的比较找出差异点。有差异的 VNode 对应的 DOM 就是需要重新渲染的节点 -> 根据有差异的 VNode 创建真实的 DOM 再插入到视图中。这就完成了一次更新。

## Vue 中的 DOM-Diff

重点在于找出新旧 VNode 的差异（DOM-Diff），以达到减少 DOM 操作的目的。

### patch

Vue 中的 DOM-Diff 过程就是 patch（词义为”补丁”）过程。核心思想之一：旧的 VNode（oldVNode）即数据变化前的虚拟 DOM 节点；新的 VNode 即数据变化后的即将要渲染的新的 DOM 节点。所以一句话总结就是：我们要以新的 VNode 为基准，改造旧的 oldVNode 使之跟新的 VNode 一样，这就是 patch 过程所要干的事情。有如下三种情况：

1. 创建节点：新 VNode 中有而旧的 oldVNode 中没有，那么就在 oldVNode 中创建。
2. 删除节点：新 VNode 中没有而旧的 oldVNode 中有，那么就从 oldNode 中删除。
3. 更新节点：新的 VNode 和旧的 oldVNode 中都有，就以新的为基准更新旧的 oldVNode。

### 创建节点

我们知道 VNode 可以描述 6 种类型的节点，其实只有三种（元素节点、文本节点、注释节点）可以被创建插入到 DOM 中。

createElm 方法（src/core/vdom/patch.js）首先判断是否为元素节点（VNode 是否有 tag 标签），如果不是在判断是否为注释节点（VNode 的 isComment 属性是否为真），如果以上两种都不是则当作文本节点创建。然后插入到 DOM 中。

![flowChartCreateNode](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/flowChartCreateNode.png)

### 删除节点

若某些节点再新的 VNode 中有而旧的 oldVNode 中没有，那么就从旧的 oldVNode 中删除。在需要删除的节点的父元素上调用 removeChild 方法即可。

### 更新节点

什么是静态节点？

节点里只包含纯文字，无可变变量。数据变化与其无关，只需渲染一次。

我们考虑以下三种情况：

1. VNode 和 oldVNode 均为静态节点

   跳过即可。

2. VNode 为文本节点(节点内只包含纯文本)

   如果 oldVNode 也是文本节点，那么比较两者文本是否一样，不一样则将 oldVNode 中文本改为 VNode 的文本；如果 oldVNode 不是文本节点，那么使用 setTextNode 方法将 oldVNode 改为与 VNode 节点文本相同的文本节点。

3. VNode 为元素节点

   1. 包含子节点 => 若 oldVNode 也包含子节点，那么递归比较更新子节点（updateChildren 方法）；若 oldVNode 不包含子节点，那么 oldVNdoe 可能为文本节点或者空节点。此时将 VNode 的子节点创建一份插入到 oldVNode 里边（若 oldVNode 为文本节点则先清空文本即可）。

   2. 不包含子节点 => 说明 VNode 为空节点，那么不管 oldVNode 里边有啥，直接清空即可。

流程图如下所示：

![flowChartUpdateNode](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/flowChartUpdateNode.png)

## 更新子节点

### 更新子节点

外层循环 VNode 的子节点 newChildren，内层循环 oldVNode 的子节点 oldChildren，逐一比较。我们会进行四种操作：

1. 创建节点

   newChildren 中的子节点在 oldChildren 中找不到，说明 oldChildren 中之前没有。那么此次需要新增，即创建节点。

2. 删除节点

   遍历完 newChildren 中的子节点，如果 oldChildren 中还有未处理的子节点，说明这些未处理的需要废弃，即删除节点。

3. 移动节点

   若 newChildren 中子节点找到和 oldChildren 中子节点相同的节点，但是位置不同，那么以 newChildren 中子节点为基准，调整 oldChildrne 中子节点位置，使之与 newChildren 中子节点相同。

4. 更新节点

   若 newChildren 中子节点找到和 oldChildren 中子节点相同的节点，并且位置相同。那么更新 oldChildren 中的子节点，使之与 newChildren 中的该子节点相同。

### 创建子节点

上述第一种情况时我们新建节点，没问题很简单，但是新建的节点应该插入到什么位置是关键 **（结论：合适的位置是所有未处理节点之前）**。

我们会将处理过的子节点打上标记，新建的节点就**应该**放在未处理节点的前边**而不是**已处理节点的后边。因为如果将新建节点放在已处理过的节点后边，那么如果下一个节点也是新建节点，这个时候会插入到上一个新建节点的前边（这是不对的）。下图有助理解：

![createSubNode](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/createSubNode.png)

### 删除子节点

见更新子节点操作 2

### 更新子节点

见更新子节点操作 4

### 移动子节点

同样，此时移动到什么位置是关键 **（结论：同创建子节点，合适位置为所有未处理节点之前）**

![moveSubNode](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/moveSubNode.png)

原因就是如果前边有新建子节点，那么放在已处理节点之后就是不合理的。

**回到源码**（_/src/core/vdom/patch.js_）

## 优化更新子节点

### 优化策略介绍

![schematicDiagram](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/schematicDiagram.png)

极端情况：前三对新旧节点都没有差异，那么第四个新节点需要第 16 次检查的时候才发现第四个旧节点与其相同。当子节点数量比较大的时候，算法复杂度会尤其高。

优化思路：未处理的节点列表先通过以下顺序（1，2，3，4）处理

![optimizationIdeas](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas.png)

新前：newChildren 里所有未处理的第一个子节点
新后：newChildren 里所有未处理的最后一个子节点
旧前：oldChildren 里所有未处理的第一个子节点
旧后：oldChildren 里所有未处理的最后一个子节点

1 新前和旧前:
如果相同则更新节点，由于位置相同无需移动；如果不同尝试后三种情况。

![optimizationIdeas1](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas1.png)

2 新后和旧后:
如果相同则更新节点，由于位置相同无需移动；如果不同尝试后两种情况。

![optimizationIdeas2](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas2.png)

3 新后和旧前:

如果相同则更新节点，然后将旧前在 oldChildren 中的位置移动到新后在 newChildren 中相同位置；如果不同尝试后最后一种情况。

![optimizationIdeas3](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas3.png)

那么该如何移动呢？我们一直强调以新的 VNode 为基准，所以新后和旧前相同的情况我们就是移动旧前到 oldChildren 的最后位置（所有未处理节点之后）。如下图:

![optimizationIdeas3-2](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas3-2.png)

4 新前和旧后:

如果相同则更新节点，然后将旧后在 oldChildren 中的位置移动到新前在 newChildren 中相同位置。

![optimizationIdeas4](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas4.png)

此时又该如何移动呢？类似第三种情况，以新 VNode 为基准，移动旧后到 oldChildren 中的第一个位置（所有未处理节点之前）。

![optimizationIdeas4-2](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vue/optimizationIdeas4-2.png)

如果上述四种优化方法没有找到相同的节点，那么按照最初的循环方式查找。

回到源码（_/src/core/vdom/patch.js_）
