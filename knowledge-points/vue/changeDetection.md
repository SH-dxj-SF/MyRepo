# 变化侦测

## 综述

数据驱动视图

**UI = render(state)**

在 Vue 中，Vue 充当了 render 的角色。Vue 发现 state 变化 => 处理 => 将变化反映到 UI 上。

如何发现 state 变化？ => 变化侦测：即追踪状态（数据变化）

Angular 通过脏值检查流程实现，React 则通过对比虚拟 DOM 实现。

## Object 的变化侦测

### 使数据变得可观测

JS 提供的 Object.defineProperty 方法定义对象属性，通过 get（读操作时触发），set（写操作时触发）方法对属性进行拦截。

Ovserver 类(src/core/observer/index.js)递归的将对象属性转化成可观测的，并给每一个属性添加一个\_\_ob\_\_属性（该属性的 Observer 实例），标记已处理，避免重复操作。

### 依赖收集

何为依赖收集？ => 将使用了（依赖）某一个数据的一方(**实际为依赖方的 Watcher 类实例**)放入该数据的依赖数组中。

当该数据变化时通知依赖数组中的每一依赖都通知一遍，告诉它们应该更新了。

何时收集？何时通知依赖更新？ => getter 中收集依赖；setter 中通知依赖更新。

收集到哪？ => 每一个数据建立一个依赖管理器，Dep 类(src/core/observer/dep.js)由此而生，实现依赖的添加，删除，通知等功能。

有了 Dep 后，在 defineReactive 方法中为每一个属性新建一个 Dep 实例 dep，然后在 getter 中调用 dep.depend 方法收集依赖，在 setter 中调用 dep.notify 方法通知所有依赖更新。

### 依赖是谁

依赖是谁？ => Wathcer 类(src/core/observer/watcher.js)，谁使用（依赖）了数据，谁就是依赖，就为谁新建一个 Watcher 类的实例 watch。

细节：Watcher 类的 get 方法会访问一次数据，触发数据 getter，使得 dep 实例将该 watch 实例添加到依赖数组中。

之后的数据变化不直接通知依赖更新，而是通知对应的 watch 实例，再由 watch 实例去通知真正的视图更新。

### 不足之处

不足之处 => object.defineProperty 方法仅能观测 object 数据的取值，写值；如果我们新增或者删除一对 key/value，它无法观测到。

Vue 新增了全局 API，Vue.set，Vue.delete 以弥补。

## Array 的变化侦测

### 何处收集依赖

同样是 getter 中，因为数组也会存在数据对象中。

### 使 Array 型数据可观测

思路：object 对象属性变化一定会触发 setter，虽然数组没有 setter，但是要想改变数组就得操作数组，操作数组的方法（push、pop、unshift、shift、splice、sort、reverse）也是屈指可数的，那么我们也就可以监测数组的变化了。

#### 数组方法拦截器：

重写操作数组的方法(src/core/observer/array.js)，数组操作不再是 Array 的原生方法，而是原生方法的扩展。

![vueArrayMethodsExtension](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/vueArrayMethodsExtension.png)

#### 使用拦截器：

将数据的\_\_proto\_\_设置为拦截器 arrayMethods,如果环境不支持\_\_proto\_\_则使用 copyArgument 方法将拦截器方法逐个定义到数据上。

### 再谈依赖收集

收集到哪？ => 因为给数组设置 getter/setter 都是在 Observer 中完成的，所以也应该在 Observer 类中收集，Observer 中实例化了一个依赖收集器，用以收集数组依赖。

如何收集？=> defineReactive 函数先调用 observe 函数获取数据的 Observer 实例。observe 函数为被获取的数组数据尝试创建一个 Observer 实例：如果数据有\_\_ob\_\_属性，则直接返回；没有则将其转化成响应式的并返回 Observer 实例。然后调用获取到的 Obsever 实例上的依赖管理器，在 getter 中收集依赖。

如何通知依赖？=> 拦截器挂载到了数组原型上，所以拦截器中的 this 就是 value，取到 value 上的 Observer 实例调用依赖管理器实例的 notify 方法通知。

### 深度侦测

不仅仅侦测自身变化，还要侦测子数据变化。

对于数组调用 Observer 调用 observeArray 方法，遍历数组中的每一个数据并将其转化为可侦测的响应式数据。

对于 object 数据，defineReactive 函数进行了递归处理(最新源码递归操作放在了 observe 函数中)。

### 新增数据的侦测

将新增的元素转化为可侦测的响应式数据，push、unshift 入参即为新增元素，splice 方法下标 2 及其以后的为新增元素。所以拦截器中检查并调用 observeArray 方法处理一下即可。

### 不足之处

我们如果使用数组下标修改元素或者修改数组的 length 属性来清除数组元素，这个时候是监测不到的。同样为了解决这个问题，全局 API: Vue.set, Vue.delete
