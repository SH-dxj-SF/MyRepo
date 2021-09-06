# 前端路由

路由概念来源于服务端，服务端中的路由描述的是 URL 与处理函数的映射关系。

在 Web 前端单页应用（SPA，Single Page Application）里，路由描述的是 URL 和 UI 之间的映射关系。这种映射是单向的，即 URL 变化引起 UI 更行（无需刷新页面）。

## 前端路由的优势：

1. 页面刷新速度快：后端路由每次访问一个新页面都得向服务器发送请求，然后根据服务器响应结果渲染页面。这个过程会网络延迟的影响。前端路由则省略了整个请求过程，只是完成组件切换。用户体验相对较好。

2. 复用性强：使用前端路由可以共用 layout、css、js，减少重复加载，性能提升。

3. 页面状态可记录：不使用前端路由，仅通过 ajax 进行局部页面切换的单页应用由于 URL 始终不变，所以不可记录页面状态。

## 如何实现前端路由？需要解决两个核心问题：

1. 如何做到 URL 改变却不引起页面刷新？
2. 如何检测 URL 变化？

## 下边讲一下 hash 和 history 两种方式的实现原理：

- hash

  1. hash 是 URL 中#后边的部分，改变 URL 中的 hash 不会引起页面刷新。hash 常用作锚点在页面内导航。

  2. 通过监听 hashchange 事件监听 URL 变化。

     ```js
     window.addEventListener('hashchange', (window, event) => {});
     ```

     通过浏览器前进/后退改变 URL、标签改变 UR L（如 a 标签锚点跳转）、window.location 改变 URL 都会触发 hashchange 事件。

- history

  1. history 提供了 pushState 和 replaceState 两个方法。这两个方法改变 URL 的 path 部分不会引起页面刷新。

  2. history 提供类似 hashchagne 事件的 popstate 事件，但这有些不同，浏览器前进/后退改变 URL 会触发 popstate 事件。但是通过 pushState/replaceState 或标签改变 URL 不会触发 popstate 事件。但是可以通过拦截这两个方法和标签的点击事件来检测 URL 变化。所以也可以监听 URL 变化，只是比 hash 麻烦些。
