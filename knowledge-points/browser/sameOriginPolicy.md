# 同源策略&跨域问题

首先我们应该知道什么导致了跨域问题的产生，这就是浏览器的同源策略（Same-origin policy）。

## 同源策略

一个重要的安全策略，用于限制一个 origin（源）的文档或者它加载的脚本如何能与另一个 origin 的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

同源：如果两个 URL 的 **protocol（协议）**、**host（域名/主机）**、**port（端口，如果指定了）** 都相同，那么它们是同源的。这个方案也被称作“协议/主机/端口元组”或者直接是“元组”。

与 URL http://store.company.com/dir/page.html 的源进行对比的示例:

URL --- 结果 --- 原因

- http://store.company.com/dir2/other.html --- 同源 --- 只有路径不同
- http://store.company.com/dir/inner/another.html --- 同源 --- 只有路径不同
- https://store.company.com/secure.html --- 失败 --- 协议不同
- http://store.company.com:81/dir/etc.html --- 失败 --- 端口不同 ( http:// 默认端口是 80)
- http://news.company.com/dir/other.html --- 失败 --- 主机不同

没有同源策略的两大危险场景：

1. 接口请求：CSRF/XSRF（Cross-site Request Forgery 即跨站请求伪造）攻击，利用网站对浏览器的信任。即便有了同源策略，cookie 是明文的，XSS（Cross-site Scripting，即跨网站脚本）仍可以获取到 cookie。这时候 HttpOnly 属性可以阻止 JavaScript 访问 cookie，一定程度上遏制这类攻击。

2. DOM 查询：钓鱼网站通过 iframe 迷惑用户，然后通过 iframe 获取真实网站中的 dom 并获取相应信息。

## XSS（Cross-site Scripting，即跨网站脚本）

一般叫作跨站脚本攻击，攻击者在网站上注入恶意的客户端代码。当受害者登陆网站时就会自动运行这些恶意代码，从而，攻击者就可以突破网站的访问权限，冒充受害者。

浏览器无法探测到这些恶意代码是不可信的，所以这些脚本可以任意读取 cookie、session tokens 或者其他敏感的网站信息，甚至让恶意脚本重写 HTML 内容。

以下两种情况容易发生 XSS 攻击：

1. 数据从一个不可靠的链接（URL）进入到一个 Web 应用程序

2. 没有过滤掉恶意代码的动态内容被发送给 Web 用户

恶意内容一般包括 JavaScript 代码，有时候也会包含 HTML、FLASH 或其他浏览器可执行的代码。XSS 攻击的形式千差万别，但是它们通常都会：将 cookie 或者其他隐私信息发送给攻击者，将受害者重定向到受攻击者控制的网页，或者经由恶意网站在受害者计算机上进行其他恶意操作。

XSS 攻击可分为三类：

1. **存储型（持久型）**

将 XSS 代码提交存储在服务器（有漏洞，不安全的）端（数据库、内存、文件系统等），当浏览器访问页面请求数据时，XSS 代码会从服务器解析之后加载出来，返回到浏览器做正常的 HTML/JS 解析执行，XSS 攻击就发生了。

一般发生在：网站留言、评论、博客日志等交互处，恶意脚本存储到客户端或者服务端的数据库中。

2. **反射型（非持久型）**

当用户点击一个恶意链接，或者提交一个表单，或者访问一个恶意网站时，注入脚本进入受害者网站。Web 服务器将注入脚本（比如一个错误信息、搜索结果等）返回到用户的浏览器。由于浏览器认为这个响应来自“可信任”的服务器，所以会执行这段脚本。

一般出现在网站的搜索栏、用户登录口等地方，常用来窃取客户端 cookie 或者进行钓鱼欺骗。

3. **DOM 型（非持久型）**

恶意脚本修改客户端的原始代码（DOM 结构），是纯粹发生在客户端的攻击。取出和执行恶意代码的都是浏览器，属于前端 JS 自身的安全漏洞。

比如客户端从 URL 提取数据并在本地执行，或者用户在客户端输入的数据包含了恶意的 JS 脚本，而且这些数据、脚本没有进行适当的过滤/消毒。需要注意这些输入源：document.URL、location.hash、location.search、document.referrer 等。

XSS 防御方式：

1. “不信任”用户输入的内容：对所用户提交内容进行可靠的输入验证，包括 URL、查询关键字、表单输入等。
2. 不使用 eval 解析执行不确定的数据、代码
3. 不使用 innerHTML 或者 outerHTML 等设置用户输入
4. 重要的 cookie 设置 httpOnly，防止客户端通过 document.cookie 获取 cookie
5. 后端接口也做关键字符过滤
6. 验证码：防止脚本提交敏感危险操作

## CSRF/XSRF（Cross-site Request Forgery 跨站请求伪造）

攻击者冒充受信任者（受害者），向服务器发送非预期请求的攻击方式。攻击者诱导受害者进入第三方网站，在第三方网站中向被攻击网站发送跨站请求。利用受害者在被攻击网站中已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击网站执行某项操作的目的。一个典型的流程如下：

1. 受害者登陆了 a.com 并保留了登陆凭证（cookie）
2. 攻击者引诱受害者访问了 b.com
3. b.com 向 a.com 发送了一个请求：a.com/action=xxx（浏览器会默认携带 cookie）a.com 接收到请求后对请求进行验证，并确认是受害者的凭证且“相信”这就是受害者发送的请求。
4. a.com 以受害者的名义执行了 act=xxx
5. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者让 a.com 执行了自己定义的操作

CSRF/XSRF 防御方式：

1. 同源检查：使用 header 中的 origin header 或者 referrer header 确定来源
2. token 检查：提交时附加本域才能获取的验证信息

## CORS（Cross-origin Resource Sharing 即跨域资源共享）

W3C 的一个标准，它允许浏览器向跨源服务器发出 XMLHttpRequest 请求，克服了 AJAX 只能同源使用的限制，是处理跨域问题的标准做法。

CORS 需要浏览器和服务器同时支持，整个 CORS 通信都是浏览器自动完成，浏览器一旦发现 AJAX 请求跨源，会自动添加一些附加的头信息。所以关键在于服务器，只要服务器实现了 CORS 接口，就可以跨源通信。

浏览器将 CORS 请求分成两类：

1. 简单请求（simple request），简单请求满足一下条件

   1. 请求方法为以下三种：
      - HEAD
      - GET
      - POST
   2. HTTP 头信息字段不超出这几种：
      - Accept
      - Accept-Language
      - Content-Language
      - Last-Event-ID
      - Content-Type：仅限这三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

2. 非简单请求（not-so-simple request），不满足上图条件的为非简单请求

   如果该跨源 AJAX 请求是简单请求，浏览器就在头部添加 Origin 字段，标识本次请求来自哪个源（协议，域名，端口），服务器根据该信息决定是否同意此次请求。

如果是非简单请求（对服务器有特殊要求，比如请求方法为 PUT、DELETE 或者 Content-Type 字段类型是 application/json），在正式通信前会增加一次 HTTP 查询请求，称为“预检”请求（preflight）。浏览器会先询问服务器，当前网页所在域名是否在服务器许可范围内，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest，否则报错。

预检请求使用的请求方法是 OPTIONS，表示该请求是用来询问的。预检请求中除了 Origin 字段，还有两个字段：

- Access-Control-Request-Method：必须，列出浏览器请求会使用到哪些 HTTP 请求方法。

- Access-Control-Request-Headers：是一个以分号“；”分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段。

服务器收到预检请求后检查以上三个字段信息，确认可以跨源请求就可以做出响应。

服务器预检响应中关键的：

Access-Control-Allow-Origin，表示允许的请求源。当该字段值为**请求源**或者“\*”时，表示同意跨源请求。其中“\*”标识允许任意跨源请求。

如果服务器否定预检请求，则会返回一个正常的 HTTP 响应。但是没有任何 CORS 相关的头信息字段。此时浏览器会认定服务器不同意预检请求，因此触发一个错误，被 XMLHttpRequest 对象的 onerror 回调函数捕获。

一旦服务器通过了预检请求，以后浏览器每次正常的 CORS 请求都会跟简单请求一样头信息携带 Origin，服务器响应也都会携带 Access-Control-Allow-Origin 字段。

与 JSONP 比较：利用\<script\>、\<img\>、\<iframe\>标签不受同源限制的特性，通过他们的 src 属性来实现跨域资源请求。

- JSONP 只支持 GET 方法，CORS 支持所有 HTTP 请求方法；

- JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。
