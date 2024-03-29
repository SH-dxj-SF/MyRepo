# HTTP 协议

HTTP（Hypertext Transfer Protocol），是一种简单的“请求—响应”协议。通常运行于 TCP 之上的一种应用层协议，具体七层关系看下图。它指定了 C 端（客户端）可能发送给服务器什么样的消息以及得到什么样的响应。

![OSIModel](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/OSIModel.png)

HTTP 是基于客户端/服务器模式，并且面向连接的。典型的 HTTP 事务处理有如下过程：

1. 客户端与服务器建立连接
2. 客户端向服务器提出请求
3. 服务器接收请求，并根据请求返回相应的文件作为应答
4. 客户端与服务器关闭连接

## HTTP 里程碑：

1. **HTTP/0.9（单行协议）**：单行指令构成，唯一可用方法以 GET 开头，其后跟目标资源路径（一旦连接到服务器，协议，服务器，端口号这些都不是必须的）。

   GET /myPage.html

   响应也极其简单，只包含响应文档本身。无响应头，状态码或错误代码，出现问题会返回一个包含问题描述的特殊的 HTML 文档，供人们查看。

<HTML\>这是一个简单的 html 页面</HTML\>

2. **HTTP/1.0（构建可扩展性）**
   协议版本信息会随每个请求发送（HTTP/1.0 被追加到了 GET 行）；

   状态码在响应开始时发送，使浏览器了解请求执行成功与否，调整相应操作；

   引入 HTTP 头的概念，无论请求还是响应，允许发送元数据，使协议更灵活，扩展性更强；

   在 HTTP 头的帮助下，具备了传输除纯文本 HTML 文件外其他类型文档的能力（同时需要感谢 Content-Type）

   典型的请求/响应看起来像这样：

   GET /mypage.html HTTP/1.0

   User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

   ***

   200 OK

   Date: Tue, 15 Nov 1994 08:12:31 GMT

   Server: CERN/3.0 libwww/2.17

   Content-Type: text/html

   <HTML\>

   一个包含图片的页面

   <IMG SRC="/myimage.gif"\>

   </HTML\>

   下边是请求一个图片的情形：

   GET /myimage.gif HTTP/1.0

   User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

   ***

   200 OK

   Date: Tue, 15 Nov 1994 08:12:32 GMT

   Server: CERN/3.0 libwww/2.17

   Content-Type: text/gif

   (这里是图片内容)

3. **HTTP/1.1（标准化的协议）** 消除了大量歧义并引入多项改进

   连接可复用，节省了多次打开 TCP 连接的时间（Keep-Alive）。一定时间内共享连接，但单连接内是有序阻塞的文本传输。

   增加管线技术，允许在第一个应答完全发送之前就就发送第二个请求，降低通信延迟。

   支持响应分块。

   引入额外的缓存控制机制。

   引入内容协商机制，包括语言，编码，类型等，并允许客户端和服务器之间约定以最合适的内容进行交换。

   Host 头，可以使不同域名配置在同一个 IP 地址的服务器上。

4. **HTTP/2（为了更优异的表现）**

   HTTP/2 是二进制协议而不是文本协议。不再可读，也不可无障碍的手动创建。

   是一个复用协议，并行的请求能在同一个连接中处理。移除了 HTTP/1.x 中顺序和阻塞的约束。

   压缩了 headers，headers 在一系列请求中常常是相似的，移除了重复和传输重复数据的成本。（动静态字典，哈夫曼码表）

   允许服务器在客户端缓存中填充数据，通过一个叫服务器推送的机制来提前请求。

5. **后 HTTP/2 进化**

   对 Alt-Svc（Alternative Service，直译为备选服务）的支持允许了给定资源的位置和资源鉴定，允许了更智能的 CDN 缓冲机制。

   Client-Hints 的引入允许客户端（通常是浏览器）主动交流它的需求，或者是硬件约束的信息给服务端。

   在 Cookie 头中引入安全相关的前缀，现在帮忙保证一个安全的 cookie 没被修改过。

HTTP/2 的多路复用对比 HTTP/1.1 复用

**HTTP/1.1 复用**

默认开启 Keep-Alive,解决了多次连接的问题。但是存在两个问题：

- 一是单连接内是串行的文件传输，比如请求 a.js、b.js、c.js 三个文件，b 得等待 a 完成响应，c 得等待 b 完成响应。

- 二假设服务器最大并发数 10，浏览器最大请求数 5，那么服务器实际只能承载 2 人并发，第三个人必须等待前方请求完成。

**HTTP/2 多路复用**

引入二进制帧、流的概念，帧会对数据进行顺序标记。这样收到数据的一方（比如浏览器）就可以按照序列将数据合并，不会出现错乱。因为有了序列，服务器可以进行数据的并行传输，这就是流做的事情。

HTTP/2 对同一域名下所有请求都基于流（同一域名下不论访问多少文件，都只建立一路连接）。这样就解决了 HTTP/1.1 中的两个效率问题。

HTTP 规范定义了 9 种请求方法，常用的有 GET、POST。完整的方法如下：

HTTP 1.0：

- GET: 请求一个资源，使用 GET 的请求应该只被用于**获取数据**。

  请求是否有主体：否；

  成功响应是否有主体：是；

  安全：是；

  幂等：是；

  可缓存：是；

  HTML 表单是否支持：是

- HEAD: 与 GET 相同，但**无响应体**

  请求是否有主体：否；

  成功响应是否有主体：否；

  安全：是；

  幂等：是；

  可缓存：是；

  HTML 表单是否支持：否

  使用场景：在下载一个文件前先获取它的大小再确定是否要下载，以节约带宽资源。

- POST: 将实体（请求体）提交到指定资源，通常导致服务器上的状态变化或副作用。请求体类型由 Content-Type 首部决定。

  请求是否有主体：是；

  成功响应是否有主体：是；

  安全：否；

  幂等：否；

  可缓存：否（Only if freshness information is included）；

  HTML 表单是否支持：是

  使用场景：

  - 注册新增用户
  - 向数据处理程序提供一批数据（如表单提交）
  - 新闻组、邮件列表或类似的文章组中发布消息
  - 注释已有的资源

HTTP 1.1：

- PUT: 使用请求中的负载**创建或替换目标资源**。与 POST 的差别主要在于 PUT 是幂等的（一次或连续多次的相同请求是等价的），无副作用。

  请求是否有主体：是；

  成功响应是否有主体：否；

  安全：否；

  幂等：是；

  可缓存：否；

  HTML 表单是否支持：否

- DELETE : 用于**删除指定资源**

  请求是否有主体：可以有；

  成功响应是否有主体：可以有；

  安全：否；

  幂等：是；

  可缓存：否；

  HTML 表单是否支持：否

- CONNECT: 可以开启一个客户端与所请求资源之间的双向沟通通道，它可以用来创建隧道。

  请求是否有主体：否；

  成功响应是否有主体：是；

  安全：否；

  幂等：否；

  可缓存：否

  HTML 表单是否支持：否

- OPTIONS: 用于获取**目的资源所支持的通信选项**

  请求是否有主体：否；

  成功响应是否有主体：是；

  安全：是；

  幂等：是；

  可缓存：否；

  HTML 表单是否支持：否

  使用场景：

  - 检测服务器所支持的请求方法，响应报文的 Allow 首部会列出支持的方法
  - CORS 中的预检请求，以检测实际请求是否被服务器所接受

- TRACE: 沿着目标资源的路径执行一个消息环回（loop-back）测试

  请求是否有主体：否；

  成功响应是否有主体：否；

  安全：是；

  幂等：是；

  可缓存：否；

  HTML 表单是否支持：否

  使用场景：

  - 一种实用的 debug 机制

- PATCH: 用于对资源进行部分修改。

  请求是否有主体：是；

  成功响应是否有主体：是；

  安全：否；

  幂等：否；

  可缓存：否；

  HTML 表单是否支持：否

## POST、PUT、PATCH 的差异：

假设我们有一个 userInfo 信息，里边有 userID、userName 等十个字段

一般人们图方便会将修改了 userName 的整个 userInfo 信息传给服务端，做完整更新。这是很浪费资源（带宽）并且有点愚蠢的。

PATCH 方法诞生了，实现局部修改，只传 userName 到指定资源，服务端只更新接收到的字段信息。

PUT 也是更新资源，但是应该提供完整的资源对象信息，理论上如果你使用了 PUT 方法但是没有提供完整的 userInfo，那么缺失的字段应被清空。

POST 可以是对已有资源的修改或者是资源新增（创建多条）。

## GET 和 POST 的异同：

本质上它们是 HTTP 的两种请求方法，HTTP 是基于 TCP/IP 的数据如何在万维网中传输的协议。所以 GET 和 POST 都是 TCP 连接。技术上它们无差别，可以做同样的事情。

GET 产生一个 TCP 数据包

浏览器将 header 和 data 一次发出，服务器响应(200)

POST 产生两个 TCP 数据包（Firefox 例外，一个包）

浏览器先发送 header=>服务器响应 100（continue）=>浏览器再发送 data=>服务器响应(200)

GET 浏览器会主动 cache，POST 手动才行；

GET 请求仅支持 url 编码，POST 支持多种编码方式；

GET 请求参数会被保留在浏览器历史记录，POST 参数不会被保留；

GET 请求在 url 中传递参数，POST 参数在请求体；

GET 请求 url 中的参数有长度限制（大多浏览器上限为 2k，大多数服务器处理长度 64k），POST 参数长度无限制；

GET 参数类型仅支持 ASCII 字符，POST 无限制；

## HTTP 响应代码（五类）：

- **信息响应**（100-199）：
  - 100 continue：这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，若已完成则忽略它。
  - 101 switching protocol：该代码是响应客户端的 upgrade 标头发出的，并且指示服务器也正在切换协议。例如：HTTP1.0 切换到 HTTP2.0；HTTP、HTTPS 切换到 WebSocket。
  - 102 processing：表示服务器正在处理该请求，但没有响应可用。
  - 103 early hints：该状态码主要与 link 链接头一起使用，以允许用户代理在服务器仍在准备响应时开始预加载资源。
- **成功响应**（200-299）：
  - 200 ok：请求成功。成功的含义取决于请求方法：
    - GET：资源已被提取并在消息正文中传输
    - HEAD：实体标头位于消息正文中
    - POST：描述动作结果的资源在消息体中传输
    - TRACE：消息正文包含服务器收到的请求信息
  - 201 created：该请求已成功，并因此创建了一个新的资源。（通常是 POST 或者某些 PUT 请求后的响应）
  - 202 accepted：请求已经收到，但还未响应，没有结果。意味着不会有一个异步的响应去表明当前请求的结果，预期另外的进程和服务去处理请求，或者批处理。
  - 204 no content：服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。
  - ...
- **重定向**（300-399）：
  - 300 multiple choice：被请求的资源有一系列可选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或者浏览器可以自行选择一个首选的地址进行重定向。
  - 301 moved permanently：请求的资源已被永久的移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。
  - 302 found：请求的资源现在临时从不同的 URI 响应请求。由于这样的重定向是临时的，客户端应继续向原有地址发送以后的请求。
  - 304 not modified：如果客户端发了一个带条件的 GET 请求且该请求被允许，而文档的内容并没有改变（自上次访问或根据请求条件判断），服务器返回改状态码。304 禁止包含消息体。
  - ...
- **客户端错误**（400-499）：
  - 400 bad request：1.语义有误，当前请求无法被服务器理解；2.请求参数有误。除非进行修改，否则客户端不应该重复提交这个请求。
  - 401 unauthorized：当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。
  - 403 forbidden：服务器已理解请求，但是拒绝执行它。
  - 404 not found：请求失败，请求所希望的资源未被在服务器上发现。
  - ...
- **服务端错误**（500-599）：
  - 500 internal server error：服务器碰到了不知道如何处理的情况
  - 501 not implemented：此请求方法不被服务器支持且无法被处理。仅有 GET、HEAD 是要求服务器支持的，它们肯定不会返回此错误码。
  - 502 bad gateway：表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。
  - 504 gateway timeout：服务器作为网关，不能及时得到响应时返回此错误代码。
  - ...

# TCP（Transmission Control Protocol）协议

是一种面向连接、可靠的、基于字节流（八位即 8 个 bit，字节表示的数据流）的传输层通信协议。使用三次握手建立一个连接，使用四次握手中断一个连接。

TCP 为了在不可靠的互联网络上提供可靠的端到端的字节流而专门设计的。（IP 层不提供这样的流机制，而是提供不可靠的包交换）

TCP 首部:

![TCPHeader](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/TCPHeader.png)

解释：

1. 序号： seq（sequence），占 32 位（bit）；用以标识从 TCP 源端向目的端的字节流，发起方发送数据时对此进行标记。
2. 确认号：ack（acknowledge），占 32 位；仅当 ACK 标志位位 1 时有效，ack=seq+1。
3. 标志位：每个占 1 位，共六个

   - URG：urgent pointer 紧急指针有效
   - ACK（Acknowledge）：确认序号有效
   - PSH（PUSH）：接收方应尽快将该报文交个应用层
   - RST（Reset）：重置连接
   - SYN（Synchronous）：发起一个连接
   - FIN（Finish）：释放一个连接

   注意：

   1. 标志位 ACK（为 1 表示有效）和 ack（表示确认信息）的区别
   2. 确认方 ack 等于发起方 seq+1，两端配对

## 三次握手（建立连接）：

1.客户端（通过执行 connect 函数）------> (SYN=1，seq=x) ------> 服务器

    SYN 包中 x 为随机值，发送完毕后客户端进入 SYN_SEND 状态
    =>
    服务器的 TCP 收到连接请求报文后，如同意则回送一个（SYN-ACK）应答。SYN 和 ACK 标志位均为 1，如下：

2.客户端 <----------（SYN=1，ACK=1，seq=y，ack=x+1）<--------- 服务器

    发送完毕后，服务器进入 SYN_RCVD 状态
    =>
    客户端收到上条报文段后，再次发送确认包 ACK。SYN 为 0、ACK 为 1，如下：

3.客户端 ----------->（ACK=1，ack=y+1，seq=x+1）-------------> 服务器

    发送完毕后客户端进入 ESTABLISHED 状态，当服务器收到该包时也进入 ESTABLISHED 状态。

图示如下：

![threeWayHandShake](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/threeWayHandShake.png)

### 半连接队列：

三次握手协议中，服务器维护一个队列。该队列为每一个客户端的 SYN 包开设一个条目，该条目表明服务器已收到 SYN 包，并向客户端发出确认，等待客户端的确认包。这些条目所标识的连接的服务器处于 SYN_RCVD 状态。当服务器收到客户端的确认包时，删除该条目，服务器进入 ESTABLISHED 状态。

### SYN-ACK 重传次数：

服务器发送完 SYN-ACK 包，若未收到客户端的确认包，则进行首次重传；等待一段时间未收到客户端确认包则进行第二次重传。如果重传次数超过系统规定的最大重传次数，系统将该连接信息从半连接队列中删除。每一次重传等待的时间不一定相同。

### 半连接存活时间：

指半连接队列中条目存活的最长时间，即服务器从收到 SYN 包到确认这个报文无效的最长时间。是所有重传包的最长等待时间总和。有时也叫做 SYN_RECV 存活时间。

应用层向 TCP 层发送用于网间传输、用字节（8 位）表示的数据流，TCP 将其（数据流）分割成适当长度的报文段（通常受计算机接入的网络的数据链路层的最大传输单元-MTU 的限制）；然后 TCP 将结果包传给 IP 层，由它来通过网络将包传输到接收端实体的 TCP 层。

TCP 为了保证不丢包就给每一个包一个序号，同时也保证了接收端实体按序接受。接收端实体对已经收到的包发送一个相应的确认（ACK）。如果发送端实体在合理的往返延时（RTT: Round-Trip Time）内没有收到确认，那么对应的数据包就被假设丢失，将会被进行重传。TCP 使用一个校验和函数来检验数据是否有错误，在发送和接收时都要计算校验和。

**正确性合法性**：校验和计算函数检验数据是否有误，发送接收均须计算

**可靠性**：超时重传和捎带确认机制

**流量控制**：滑动窗口协议，协议中规定窗口内未经确认的分组需要重传

**拥塞控制**：TCP 拥塞控制算法（也称 Additive Increase Multiplicative decrease 即 AIMD 算法），动态改变窗口大小

TCP 为每条连接维护一个拥塞窗口（congestion window），其中拥塞控制算法又包含四个核心算法：

1. **慢启动（slow start）** TCP 连接刚建立或者超时重传后，慢慢提速，试探网络承受能力，以免直接扰乱网络通道的秩序。

   a) 连接初始化拥塞窗口 cwnd 大小为 1，表明可以传一个 MSS（MaximumSegment Size）大小的数据。

   b) 每当收到一个报文段的确认 ACK，cwnd 加 1，呈线性上升。

   c) 每当过了一个 RTT（Round-Trip Time），cwnd 乘以 2 翻倍，呈指数上升。

   d) 当 cwnd 大于等于慢启动阐值即 cwnd >= ssthresh (slow start threshold)时，就会进入拥塞避免算法。

2. **拥塞避免（congestion avoidance）**

   a) 每收到 cwnd 个报文段 ACK 后，cwnd 才加 1。即 cwnd = cwnd + (1 / cwnd)。

   b) 每当过了一个 RTT，cwnd 加 1。

TCP 拥塞控制默认认为网络丢包是网络拥塞造成的。所以一般 TCP 控制算法以丢包为网络进入拥塞的信号。对于丢包的判断有两种方式：1 重传定时器（RTO：Retransmission Timeout）超时；2 源端收到 3 个重复的确认包 ACK。拥塞时，进入下面两个算法

3. **快速重传（fast recovery）** 超时重传的改进

   超时重传是保证数据可靠性的重要机制，在源端发送数据后开启一个计时器，如果在一定时间内没有收到接收方确认包 ACK，则重新发送，直至发送成功。

   当重传计时器超时，TCP 会重传数据包。同时 TCP 认为该情况比较糟糕，所以反应也比较强烈，做一下处理：

   a) 将慢启动阐值修改为当前 cwnd 的一半即 ssthresh = cwnd / 2。

   b) cwnd 置为 1。

   c) 进入慢启动。

   快速重传在源端收到 3 个重复确认包 ACK 时立即进入重传，无需等待重传计时器超时。所以叫快速重传。此时做一下处理：

   a) cwnd = cwnd / 2。

   b) 慢启动阐值改为缩小后的拥塞窗口大小即 ssthresh = cwnd。

   c) 进入快速恢复。

4. **快速恢复**，进入快速恢复前，快速重传算法已经将 ssthresh 和 cwnd 都置为 cwnd 的一半，所以快速恢复做一下处理：

   a) cwnd = cwnd（与 ssthresh 相同） + 3MSS（一般为收到重复的确认包的个数 \* MSS，这里因为收到了 3 个）。

   b) 此后每当收到一个重复确认包则 cwnd 加 1。

   c) 当收到重传的数据确认包 ACK 时，将 cwnd 置为 ssthresh。

   d) 进入拥塞避免。

## 四次握手（连接终止）：

由于 TCP 时全双工的，所以每个方向必须单独关闭。这个原则是当一方数据发送任务完成后就可以发送一个 FIN 包来终止该端到另一端的连接。收到 FIN 只意味着对方不再发送数据（该数据指正常连接时的数据，非确认报文）到该端。该端仍可以向对方发送数据。首先发送 FIN 的一方执行主动关闭，另一端执行被动关闭。

下边演示客户端主动关闭过程：

1.客户端（通过执行 close 函数）------- (FIN=1，seq=x) ------> 服务器

    FIN 包中 x 为随机值，发送完毕后客户端进入 FIN_WAIT_1 状态
    =>
    服务器的 TCP 收到 FIN 包后，发送 ACK 回应，如下：

2.客户端 <-------------（ACK=1，seq=y，ack=x+1）<----------- 服务器

    发送完毕后，服务器进入 CLOSE_WAIT 状态，期间服务器可能还在传输数据。
    =>

客户端 <--------------------（ 数据） <------------------ 服务器

    =>
    当客户端收到服务器 ACK 包后进入 FIN_WAIT_2 状态，待服务器数据传输完毕则发送 FIN 包，如下：

3.客户端 <---------（FIN=1, ACK=1，seq=z，ack=x+1）<-------- 服务器

    发送完毕后，服务器进入 LAST_ACK 状态
    =>
    客户端收到 FIN 包，回应服务器发送 ACK 包如下：

4.客户端 ----------->（ACK=1，ack=z+1，seq=x+1）-----------> 服务器

    发送完毕后客户端进入 TIME_WAIT 状态，等待 2MSL（Maximum Segment Lifetime）时间后进入 CLOSED 状态。当服务器收到该包时进入 CLOSED 状态。

客户端等待 2MSL 才关闭的目的：

1. 让此次连接中的所有报文在网络中消失，避免干扰后一个连接。

2. 保证最后一个 ACK 成功被服务器接收，因为如果服务器没有收到，则会重发 FIN 包，客户端再次收到 FIN 包后再回复 ACK 包并重启计时器…

图示如下：

![fourWayHandShake](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/fourWayHandShake.png)
