# 浏览器存储

https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie

浏览器存储目前有五种：LocalStorage（window）、SessionStorage（window）、indexedDB（window）、WebSQL、Cookies（document）

常用的主要有：

1. LocalStorage：调用 window.localStorage 会返回一个 Storage 对象

   window.localStorage（只读）属性允许访问一个 Document 源（origin）的对象 Storage，每个源维持一个独立的存储区域，使用不同的 Storage 对象（独立运行和控制）。

   存储的数据将会保存在浏览器会话中，和 sessiongStorage 类似，区别在于 localStorage 数据长期保存（就算浏览器关闭了，直到手动清理），sessionStorage 中的数据在当前页面会话结束就会被清理。

   localStorage 中的键值对总是以字符串形式存储，意味着和 js 对象相比，数值类型的键值对会被转换成字符串。

   - 添加更新数据：localStorage.setItem('key', 'vallue');
   - 获取数据：localStorage.getItem('key');
   - 移除数据：localStorage.removeItem('key');
   - 移除所有数据：localStorage.clear();
   - 同样的你可以像使用一般对象那样使用 localStorage

   例如：

   ```js
   localStorage['testKey'] = 'testValue';
   ```

2. SessionStorage

   和 localStorage 基本一致，差别在于 sessionStorage 在**会话期间（即只要浏览器处于打开状态，包括页面重新加载和恢复）**可用，会话结束时即清除数据。

   在此补充一下 Storage 对象知识。

   ```ts
   /** 提供了访问特定域名下的会话存储或本地存储的功能 */
   interface Storage {
     /** 返回一个整数，表示存储在Storage对象中的数据项数量 */
     readonly length: number;

     /** 清空存储中所有键名 */
     clear(): void;

     /** 参数键名，获取对应值 */
     getItem(key: string): string | null;

     /** 参数n为一个整数，返回存储中第n个键名 */
     key(index: number): string | null;

     /** 参数键名，将该键名从存储中移除 */
     removeItem(key: string): void;

     /** 参数键和值，将键值对添加到存储中，若键名已存在则更新对应值 */
     setItem(key: string, value: string): void;

     /** 索引签名 */
     [name: string]: any;
   }
   ```

3. Cookies

   默认在浏览器关闭时清除，也可以手动设置过期时间。

   document.cookie（可以当作 getter 和 setter）返回一个字符串，其中包含所有的 cookie，每条 cookie（key=value 键值对）以分号和空格（; ）分隔。cookie 中不允许使用逗号、分号、空格等。可以使用 encodeURIComponent()方法来处理

   获取：const allCookies = document.cookie；

   设置：document.cookie = newCookie； newCookie 是一个键值对形式的字符串，这个方法使用一次只能设置或者更新一个 cookie。

   以下可选 cookie 属性可跟在键值对后边用来具化对 cookie 的设定或更新，分号分隔：

   1. ;path=path

      例如：’/’、’/mydir’，默认为当前文档位置的路径，子路径可访问父路径的数据

   2. ;domain=domain

      例如：”example.com”、”subdomain.example.com”，默认为当前文档位置的路径的域名部分；与早期规范相反的是在域名前加’.’将会被忽略；若指定了一个域，那么子域也包含在内，即子域可以访问父域的数据

   3. ;max-age=max-age-in-seconds

      例如：60\*60\*24\*365 为一年

   4. ;expires=date-in-GMTString-format

      例如：”Thu, 25 Mar 2021 09:07:30 GMT”，未定义则在会话结束时过期

   5. ;secure

      cookie 只通过 https 协议传输

   注意 ⚠️：对于永久 cookie 我们使用"Fri, 31 Dec 9999 23:59:59 GMT"。如果不想使用这个日期那么可以使用*世界末日* "Tue, 19 Jan 2038 03:14:07 GMT"，这是 32 位带符号整数能表示从 1 January 1970 00:00:00 UTC 开始的最大秒长（即 01111111111111111111111111111111, 是 new Date(0x7fffffff \* 1e3)）

   示例：

   ```js
   document.cookie = 'test=dxj;expires=Thu, 25 Mar 2021 09:19:55 GMT';
   ```
