# CSS 动画

实现动画的几种方式：transform 自身并不能实现动画效果，它只是实现一些变换。

- transition

  为一个元素不同状态之间切换的时候，定义过渡效果。比如不同伪元素之间切换（:hover、:active），或者 JS 实现的状态变化。transition 属性为 transition-property、transition-duration、transition-timing-function、transition-delay 这四个属性的简写。语法：

  ```css
  .test {
    transition: tran-property tran-duration tran-timing-function tran-delay;
  }
  ```

  多个过渡属性之间使用逗号隔开：

  ```css
  .test {
    transition: width 1s, color 0.5s ease-in-out 0.5s;
  }
  ```

- transform

  该属性允许旋转、缩放、倾斜、平移给定元素。这是通过修改 CSS 视觉格式化模型的坐标空间来实现的。一般配合 transition 来使用的。语法：

  ```css
  .test {
    transition-property: transform;
  }
  .test:hover {
    transform: rotate(45deg);
  }
  ```

注意 ⚠️：只能转换由盒模型定义的元素。

- animation

  为元素指定一组或多组动画（多组之间逗号分隔）。animation 属性是 animation-name、animation-duration、animation-timing-function、animation-delay、animation-iteration-count、animation-direction、animation-fill-mode、animation-play-state 的简写。配合@keyframes 指定动画关键帧使用，语法：

  ```css
  .test {
    animation: aniTest 1s ease-in infinite;
  }

  @keyframes aniTest {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
  ```

  animation 属性初始值：

  - animation-name: none
  - animation-duration: 0s
  - animation-timing-function: ease
  - animation-delay: 0s
  - animation-iteration-count: 1
  - animation-direction: normal
  - animation-fill-mode: none
  - animation-play-state: running

## transition 和 animation 的区别：

**transition** 只能定义初始和结束状态，然后两个状态之间通过平滑过渡方式来实现动画，需要状态变化触发；

**animation** 可以定义任意状态，在状态无变化（不触发事件）的时候，也可以显示的随时间变化来改变元素 CSS 属性，达到一种动画的效果。

## window.requestAnimationFrame（非 CSS 方式）

告诉浏览器，希望执行一个动画。并且要求浏览器在**下次重绘之前**调用指定的回调函数更新动画。

注意 ⚠️：如果你想在下次浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 window.requestAnimationFrame 方法。

回调函数调用频率通常是**每秒 60 次**，但是在大多遵循 W3C 建议的浏览器中，回调函数执行频率通常**与浏览器屏幕刷新频率相匹配**。并且会了提高性能和电池寿命，在大多数浏览器里当 requestAnimationFrame()运行在后台标签页或者隐藏的<iframe\>时，requestAnimationFrame 将会被暂停。

回调函数会被传入 DOMHighResTimeStamp 参数，该参数指示当前时间（基于时间原点以来的毫秒数）。**时间原点**是标准时间，被认为是当前文档生命周期的开始。当多个被 requestAnimationFrame 排队的多个回调函数被开始在同一帧执行时，每一个回调函数接收到的时间戳都是相同的（尽管在计算上一个回调函数的工作量的过程中消耗了一些时间）。时间戳是一个十进制数，单位毫秒（ms），但最小精度是 1ms（1000μs）

注意 ⚠️：请确保总是使用第一个参数（或其他获取当前时间的方法）计算每次调用之间的时间间隔。否则动画在高刷新率的屏幕中会运行的更快。

注：时间原点计算方法如下：

- 如果脚本的全局对象是 window，确定方法如下：

  - 当前文档是 window 中加载的第一个文档，那么时间原点是浏览器上下文被创建好的时间。

  - 如果在卸载前一个被 window 加载的文档的过程中，一个确认框被展示出来询问用户是否确定离开前一个页面，那么时间原点是用户确定导航到新页面被接受的时间。

  - 如果上述方法均不能确定时间原点，那么时间原点是负责创建当前窗口文档的导航发生的时间。

- 如果脚本的全局对象是 WorkerGlobalScope（即脚本作为一个 web worker 在运行），那么时间原点就是 worker 被创建好的时间。

- 其他情况，时间原点是无定义的。

方法参数：callback，下次重绘之前更新动画所需要调用的函数（即上边所说的回调函数）。

方法返回值：请求 id，一个 long 整数，回调列表中唯一的标识。非零值，没有其他含义，你可以将其传给 window.cancelAnimationFrame 方法来取消回调函数。

范例：

```js
let element = document.getElementById('elementID');
let start;
function stepAni(timestamp) {
  if (!start) {
    start = timestamp;
  }
  const elapsed = timestamp - start;
  const offset = Math.min(elapsed * 0.1, 200); // 确保元素停在 200px 的位置。
  element.style.transform = `translateX(${offset}px)`;

  if (elapsed < 2000) {
    // 两秒后停止动画
    window.requestAnimationFrame(stepAni);
  }
}
window.requestAnimationFrame(stepAni);
```
