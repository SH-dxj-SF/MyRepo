# JS 执行上下文

执行上下文可以抽象的表示为一个简单对象。每一个执行上下文都具有跟踪其关联代码的执行进度的一组属性（我们可以称为上下文状态）。
当一段 JS 代码在运行的时候，它实际上是运行在**执行上下文**中。下面三种类型的 JS 代码会创建一个新的执行上下文：

1. 全局上下文是为运行代码主体而创建的执行上下文，也就是说它是为了那些存在于 JS 函数之外的任何代码创建的。一个程序中只会存在一个全局上下文（它会做两件事：1 创建一个全局对象，浏览器中也就是 window 对象 2 绑定 this 为这个全局对象）
2. 每个函数会在**执行的时候**创建自己的执行上下文（通常说的“本地上下文”）
3. 使用 eval()也会创建一个新的执行上下文
   ![上下文结构（摘自某 Facebook 程序员解读）](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/executionContextStructure.png)

除了上述三个必须的属性（变量对象，作用域链，this 值）之外，执行上下文还可以具有其他状态，取决于具体实现。

1. 变量对象：是和执行上下文关联的数据容器，它是一个特殊的对象，用于存储在上下文中定义的变量和函数声明。注意：函数表达式不包含在变量对象中（与函数声明相反）。变量对象是一个抽象的概念，在不同的上下文类型中，实际上是使用不同的对象呈现的，例如全局上下文中，变量对象就是全局对象本身（所以我们可以使用全局对象的属性名称引用全局变量）

   ```js
   var foo = 10;
   function bar() {} // 函数声明——function declaration
   (function bar() {}); //函数表达式——function expression

   console.log(
     this.foo === foo; // true
     window.bar === bar; // true
   )
   ```

   活动对象（Activation Object）: 在函数上下文中，用活动对象表示变量对象。函数的变量对象也是简单的变量对象，但是除了变量和函数声明外，还储存着形式参数和参数（arguments）对象，我们称之为活动对象。

   注意 ⚠️：ES5 中已经将变量对象和活动对象的概念整合到词法环境模型中。

2. 作用域链：作用域链是一个能被代码作用域中查询到标识符的对象列表。这里的规则也很简单并且类似于原型链：如果在自己的作用域（自己的变量对象、活动对象）中找不到某个变量。他会去查找父级的变量对象，以此类推。

   关于上下文，标识符是：变量名、函数声明、形式参数等。当函数在其代码中的引用**不是**局部变量（局部函数或形式参数）时，这类变量称之为自由变量（free variable）。为了精确地查找这些自由变量，我们使用到了作用域链。

   通常，作用域链是所有父级变量对象的列表，再加上（在作用域链的前面）函数自身的变量/活动对象。但是作用域链还可能包含其他任何对象，例如在上下文执行期间动态被添加到作用域中的对象（with 子对象、catch 子句的特殊对象）。

   当解析（查找）标识符时，会从活动对象开始搜索作用域链，然后（如果自身活动对象中没有找到标识符）会一直搜索到作用域链的顶层，就像原型链一样。

   ```js
   var x = 10;
   (function foo() {
     var y = 20;
     (function bar() {
       var z = 30;
       // x 和 y 是自由变量，可以在 bar 的作用域链的下一个（bar 的活动对象后的）对象中查询到
       console.log(x, y, z);
     })();
   })();
   ```

   我们可以假设通过隐式的\_\_parent\_\_属性来链接作用域对象，该属性指向链中的下一个对象。该技术在 ES5 中被应用（被命名为 outer）。作用域链的另一种表现形式也可以是一个简单数组。这里我们演示一下使用\_\_parent\_\_概念的上述代码：

   ![作用域链](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/scopeChain.png)

   在代码执行期间，可以用 with 或者 catch 子句对象来扩展作用域链。由于这些对象也都是简单对象，所以他们也可能具有原型（和原型链）。这也导致了作用域查找其实是二维的 1 首先考虑作用域链；2 其次在每个作用域链接上，深入到链接的原型链（如果链接有原型）

   ```js
   Object.prototype.x = 10;
   var w = 20;
   var y = 30;
   //在 SpiderMonkey（Mozilla 项目的一部分，用 C 语言实现的 JS 脚本引擎）中
   //全局上下文的变量对象继承自“Object.prototype”
   // 所以这里我们可以打印出没有定义的全局变量 x
   // x 是从原型链中查找到的。
   console.log(x);
   (function foo() {
     // foo 的局部变量
     var w = 40;
     var x = 100;
     // x 在 Object.prototype 中被查找到
     // 因为{z: 50}继承了它
     with ({ z: 50 }) {
       console.log(w, x, y, z); // 40 10 30 50
     }
     // with 对象从作用域链中移除后
     // x 在 foo 函数上下文的活动对象中查找到
     // w 同样也是局部的
     console.log(x, w); // 100 40

     console.log(window.w); // 20
   })();
   ```

   结构如下：在查找\_\_parent\_\_链接前，会先考虑\_\_proto\_\_链

   ![带原型链的作用域链](https://github.com/SH-dxj-SF/MyRepo/blob/master/images/scopeChainWithProto.png)

   注意 ⚠️：并不是所有实现中，全局对象都从 Object.prototype 继承。

   在所有父变量对象都存在的时候，从内部函数获取父级数据并没有什么特别的，我们只是遍历作用域链来解析（查找）我们所需要的变量。但是我们知道当上下文结束后，其所有状态和其本身都将被销毁。同时，内部函数从父函数返回。此外，这个被返回函数
   可能稍后在另一个上下文中被激活。如果一个自由变量的上下文已经消失，那个这种激活将是什么？在一般的理论中，有助于该理论的概念称之为闭包（closure）。在 ES 中，闭包和作用域链概念直接相关。下一节（JS 闭包）中我们会详细分析闭包。

3. this 值：是一个与执行上下文相关的特殊对象。因此我们可以将其称为上下文对象（即在一个被激活的执行上下文中的对象）。任何对象都可以用作上下文的 this 值，一个重要的提醒是：this 值是执行上下文的属性，而不是变量对象的属性。

   这个特性非常重要，因为和变量相比，该值永远不会参与标识符的解析（查找过程）。即在代码中访问它时，是直接在执行上下文中获取而无需任何作用域链查找。该值在进入上下文时就被确定了。

   注意 ⚠️：在 ES6 中，this 值变成了词法环境中的一个属性，即 ES3 中的变量对象的一个属性。此举目的在于支持尖头函数功能（() => void），该功能具有词法 this，它们从父级上下文中继承。

   在全局上下文中，this 值就是全局对象其自身（意味着 this 等于变量对象。）

   ```js
   var x = 10;
   console.log(x, this.x, window.x); // 10 10 10
   ```

   在函数上下文中，this 值在每一次单独的调用中可能会不同。在这里，this 值由调用者通过调用表达式的形式提供（即函数被激活的方式）。例如下例中，foo 是一个被调用方，它在全局上下文（一个调用方）中被调用。

   ```js
   function foo() {
     console.log(this);
   }
   foo(); // 全局对象
   foo.prototype.constructor(); // foo.prototype
   var bar = {
     baz: foo,
   };
   bar.baz(); // bar
   bar.baz(); // 还是 bar
   (bar.baz = bar.baz)(); // 但这是全局对象
   (bar.baz, bar.baz)(); // 全局对象
   (false || bar.baz)(); // 全局对象
   var otherFoo = bar.baz;
   otherFoo(); // 还是全局对象
   ```

   现在我们比较在全局上下文和函数上下文中 this 值的区别：

   - 全局上下文中的 this 值：

     此时，情况变得很简单。全局代码中，this 值总是全局对象本身。因此可以间接的引用它。

     ```js
     // 显示地定义全局对象属性
     this.a = 10; // global.a = 10
     console.log(a); // 10
     // 隐式地定义，通过分配给非完全限定(unqualified)的标识符
     b = 20;
     console.log(this.b); // 20
     // 同样隐式地通过变量声明，因为变量对象在全局上下文中就是全局对象本身
     var c = 30;
     console.log(this.c); // 30
     ```

   - 函数上下文中的 this 值：

     在这类代码中 this 值第一个（并且可能是最重要的）特性，就是没有静态的绑定到函数。

     上面我们提到过，this 值在进入上下文时才被确定。并且每一次使用函数时 this 值都可能不同。然而，在代码运行时 this 值是不可变的，即不可能为其分配一个新值，因为它不是变量。

     ```js
     var foo = {x: 10};
     var bar = {
       x: 20,
       test: function() {
         console.log(this === bar); // true
         console.log(this.x); // 20
         this = foo; // 错误，不可修改this
         console.log(this.x); // 20 如果上一行不会报错的话: 应该是10
       }
     }
     // 进入上下文时 this 值被确定为 bar
     foo.test = bar.test;
     bar.test(); // true 20 20

     foo.test = bar.test;
     // 然而这里 this 值指向了 foo，尽管我们调用同一个函数
     foo.test(); // false 10 10
     ```

每一个上下文在本质上都是一种作用域层级。每段代码开始执行的时候都会创建一个新的上下文来运行它，并在代码退出的时候销毁掉。

我们来看一段代码，做一个简要的分析：

```js
let outputElem = document.getElementById('output');
let userLanguages = {
  Mike: 'en',
  Teresa: 'es',
};

function greetUser(user) {
  function localGreeting(user) {
    let greeting;
    let language = userLanguages[user];

    switch (language) {
      case 'es':
        greeting = `¡Hola, ${user}`;
        break;
      case 'en':
      default:
        greeting = `Hello, ${user}`;
        break;
    }
    return greeting;
  }

  outputElem.innerHTML += localGreeting(user) + '<br/>\r';

  greetUser('Mike');
  greetUser('Teresa');
  greetUser('Veronica');
}
```

这段代码包含了三个执行上下文，其中有些会在程序运行过程中多次创建和销毁。每个上下文创建的时候会被推入执行上下文栈。当推出的时候，它会从执行上下文栈中移除。

- 程序开始运行时，全局上下文就会被创建好。---[GloCtxt]
  - 执行到 greetuser(‘Mike’)时，会为 greetUser()函数创建一个它的执行上下文，这个上下文会被推入执行上下文栈中。---[ GloCtxt, GreUserCtxt]
    - 当 greetUser()调用 localGreeting()的时候会为 localGreeting()创建一个它的执行上下文并将其推入执行上下文栈中。---[ GloCtxt, GreUserCtxt, LocGreCtxt]。在 localGreeting()退出的时候它的上下文会被执行上下文栈弹出并销毁。---[ GloCtxt, GreUserCtxt]。程序从执行上下文栈中获取下一个上下文并恢复执行，即 greetingUser()的剩余部分开始执行。
    - greetingUser()执行完毕其上下文也弹出销毁。---[GloCtxt]
  - 当 greetuser(‘Teresa’)执行时，程序又为其创建一个上下文并推入栈顶---[ GloCtxt, GreUserCtxt]
    - …
    - …
  - …
    - …
    - …
- 主程序退出全局执行上下文从执行栈中弹出。此时栈中所有上下文都已弹出，程序执行完毕。

以这种方式来使用执行上下文，使得每一个程序和函数都能够拥有自己的变量和其他对象。每个上下文还能额外的跟踪程序中下一行需要执行的代码以及一些对上下文很重要的信息。以这种方式使用上下文和上下文栈使得我们可以对程序运行的一些基础部分进行管理，包括局部变量和全局变量，函数调用与返回等。

关于递归函数（多次调用自身的函数），每次递归调用自身都会创建一个新的执行上下文，这使得 JS 运行时能够追踪递归的层级和递归中得到的返回值，这也意味着每次递归都会消耗内存来创建新的上下文。

执行上下文分两个阶段：

1. 创建阶段

   三件事情：

   1. 确定 this，官方称为 This Biding；
   2. 确定词法环境（ES5 新概念），ES3 中就是作用域链。包含**环境记录（ES3 中的活动对象）**和对**外部环境的引入记录**两部分组成；
   3. 确定变量环境，也可以称之为词法环境。ES6 中它和词法环境的差别在于词法环境用于存储函数声明、let、const 声明的变量；而变量环境只用于存储 var 声明的变量。创建阶段 var 声明的变量已经被赋值为 undefined 而 let const 声明的变量为<uninitialized\>。函数声明被赋值为自身函数。这也是就是函数声明和变量声明提升的本质所在。注意 ⚠️：变量声明提升只是声明提升，初始化并不会提升。

      ```js
      // JavaScript只会提升声明，不会提升其初始化。如果一个变量（var声明的）被先使用而后声明和初始化，那么使用时的值为undefined
      console.log(num); // undefined
      var num;
      num = 6;
      ```

      ```js
      // 如果先赋值，再使用，最后声明，那么使用时能取到所赋的值
      num = 6;
      console.log(num); // 6
      var num;
      ```

2. 执行阶段

   执行阶段根据之前环境记录对应赋值，var 声明的变量有值就赋值（创建阶段为 undefined），let const 变量有值赋值（创建阶段为<uninitialized\>），没有值则赋值为 undefined。
