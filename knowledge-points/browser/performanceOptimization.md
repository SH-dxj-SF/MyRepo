# 白屏&首屏优化

## 白屏时间

浏览器响应用户输入的地址开始，到浏览器开始渲染内容的这段时间。通常认为文档\<head\>解析完成，或者\<body\>开始渲染是白屏结束的时间点。

影响因素：网络、服务端性能、前端页面结构设计

## 首屏时间

浏览器响应用户输入的地址开始，到浏览器首屏内容渲染完毕的这段时间。

白屏时间是首屏时间的子集：首屏时间 = 白屏时间 + 首屏渲染时间

影响因素：白屏时间、资源下载执行时间

## 优化方式

1. CDN 缓存：减少资源传输距离

2. 资源文件压缩

3. 静态文件缓存方案，文件 hash 配合浏览器强缓存

4. 前端资源动态加载：

   1. 路由懒加载，以页面为单位，进行动态加载

   2. 组件动态加载，不在当前视窗的资源先不加载

   3. 图片懒加载，同上一条。一个好消息就是越来越多的浏览器支持原生懒加载，通过给 img 标签加上 loading=“lazy”以开启懒加载模式。

5. 页面使用骨架屏：即首屏加载出来之前，通过渲染一些简单的占位元素，减少用户等待的急躁情绪（通常很有效）。

6. 服务端渲染：服务端进行首屏数据的请求，返回到浏览器的 html 已经是含有首屏内容的。

7. script 标签的 async 和 defer 属性 ：

   1. async：该属性可以消除解析阻塞的 JavaScript。对于经典脚本，将会被并行请求并尽快解析执行；对于模块脚本，该脚本及其所有依赖都会在延缓队列中执行，所以它们会被并行请求，并尽快执行。使用 async 的脚本加载执行顺序会被打乱。

   2. defer：通知浏览器该脚本将在文档完成解析后，触发 DOMContentLoaded 事件前执行（即立即下载，延迟执行），意味着有 defer 属性的脚本会阻塞该事件，直到脚本被加载并解析完成。模块脚本默认 defer，即 defer 属性只对经典脚本有意义。使用 defer 的脚本顺序还是保持书写顺序。

8. ...

## 图片懒加载

懒加载其实就是延迟加载，目的主要是优化网页性能。优先加载可视区域的图片资源而非一次性加载所有。

原理：\<img/\>标签有一个 src 属性，用来表示这个图像元素的 URL，但 URL 不为空时，浏览器就会根据这个值发送请求（没有值的时候就不发送请求）。正是利用这个属性来实现懒加载。我们先将 URL 放到比如说 data-src 中，在需要的时候（即元素进入可是区域时）将 URL 取出并设置到 src 属性。

判断是否在可视区域有三个常见方法：

1. 通过 clientHeight（可视窗口高度）、offsetTop（元素 border 顶部距离父元素 offsetParentborder 顶部距离）、scrollTop（可视窗口纵向滚动距离）计算：

   img.offsetTop < viewWindow.scrollTop + viewWindow.clientHeight 成立的话说明在可视区域。

2. Element.getBoundingClientRect 方法返回元素的大小以及相对视口的位置。我们比较 img 元素的 top、bottom 和滚动容器元素的 top、bottom：

   (img.top > container.top && img.top < container.bottom) || (img.bottom > container.top && img.bottom < container.bottom)

   注意 ⚠️：该方法性能不佳

3. IntersectionObserver 构造方法：提供一种异步观察目标元素和其祖先元素或者文档视窗(viewport)交叉状态的方法。祖先元素和视窗(viewport)被称为根(root)。InsectionObserver 对象的 insectionRatio 属性（[0.0, 1.0]），大于 0 小于等于 1 代表相交，即在祖先可视区域内。

   注意 ⚠️：不支持 IE，而且其对象属性还处于实验性阶段，

需处理三个事件：scroll（滚动）、resize（窗口大小改变）、orientationChange（设备方向改变）。这里我们使用第一种方式来大致实现一下：

```js
// 我们假设懒加载的 img 标签类名为 img-lazy-load，滚动容器 id 为 container
// 并且 img 真实 URL 先存储在 data-src 属性上。
// DOMContentLoaded 事件在初始的 HTML 文档被完全加载和解析完成后被触发。无需等待样式表、图像、子框架完全加载。
document.addEventListener('DOMContentLoaded', function () {
  const lazyLoadImgs = document.querySelectorAll('img.img-lazy-load');
  const container = document.getElementById('container');
  let timer; // 用于防抖

  function lazyLoad() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      lazyLoadImgs.forEach((item) => {
        // 在可视区域内
        if (item.offsetTop < container.clientHeight + container.scrollTop) {
          item.src = item.dataset.src;
          item.classList.remove('img-lazy-load');
        }
      });
      if (lazyLoadImgs.length === 0) {
        container.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationChange', lazyLoad);
      }
    }, 100);
    container.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
  }
});
```
