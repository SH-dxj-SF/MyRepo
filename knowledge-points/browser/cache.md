# DNS 缓存

# CDN 缓存

# 浏览器缓存（暂时理解为 HTTP 缓存\_2021.5.11）

浏览器缓存的目的是为了**节约网络资源并加速浏览**。通过复用以前获取的资源，可以显著提高网站和应用程序的性能。Web 缓存减少了等待时间和网络流量，因此减少了显示资源表示形式所需的时间。

## 分类

强缓存和协商缓存，浏览器再次向服务器请求时，先判断是否命中强缓存，没有命中再判断是否命中协商缓存。

- **强缓存**：浏览器先获取该资源缓存的响应头信息（response header），根据其中的 Cache-Control 和 Expires 信息（表示失效时间）判断是否命中。若命中则直接从缓存中获取信息，包括缓存的响应头信息，此次请求不会与服务器通信。

  - Expires（**http1**）：一个绝对时间的 GMT 格式的字符串，比如 Expires:Mon,18 Oct 2066 23:59:59 GMT。代表缓存的过期时间，在此之前缓存有效。

    **缺点**：由于是一个绝对时间，当浏览器和服务器时间偏差过大时会导致缓存混乱。

  - Cache-Control（**http1.1**）：主要会使用该字段的 max-age 值（一个相对时间，单位为秒/s）来进行判断。例如 Cache-Control：max-age=3600，代表资源有效时间为 3600 秒。除了 max-age 还有几个常用的值：no-cache（需进行协商缓存）、no-store（禁止缓存）、public（可被所有用户缓存，包括终端用户和 CDN 等中间代理服务器）、private（只能被终端用户的浏览器缓存）。

  Expires 和 Cache-Control 可以在服务端配置同时开启，且 Cache-Control 优先级更高。

- 协商缓存：当强缓存没有命中时，浏览器发送请求到服务器，此次请求携带首次请求资源时返回的和缓存相关的响应头信息（Last-Modified/IF-Modified-Since、ETag/If-None-Match）。服务器通过此次请求携带的相关头信息来比对结果是否命中。

  - Last-Modified/IF-Modified-Since：浏览器第一次请求某个资源时，服务器响应头信息里会加上 Last-Modified 信息（一个时间，标识该资源最后一次修改时间）。当浏览器再次请求该资源时，请求头会携带 IF- Modified-Since 字段（值为之前服务器返回的 Last-Modified 字段值）。服务器收到请求后，比对这两个字段值来确定是否命中。

    **如果命中**：返回状态码 304（Not-Modified） 并且不会返回资源内容和 Last-Modified。

    **如果未命中**：返回新的资源内容和新的 Last-Modified

    **缺点**：较短时间内资源发生变化，Last-Modified 并不会改变；周期性变化，即资源改变后又回到了之前的状态，这个时候应该是可以使用缓存的，但是 Last-Modified 已经更新了。

    - ETag/If-None-Match：一个校验码（唯一标识），保证每一个资源都是唯一的。资源变化导致 ETag 变化。请求资源时服务器响应头加上 ETag 字段，当浏览器再次请求该资源时，请求头中会加上 If-None-Match 字段，然后服务器比对这两个字段，确定是否命中。

      **如果命中**：服务器返回状态码 304 且会返回 ETag（因为 ETag 重新生成过，即使和之前的一样）。

      **如果未命中**：返回新的资源内容

  Last-Modified/IF-Modified-Since 和 ETag/If-None-Match 可以一起使用，但是服务器优先验证 ETag，一致情况下再去比对 Last-Modified，最后决定是否返回 304。

## 总结

当浏览器请求一个已经请求过的资源时，一般这样：

1. 检查是否命中强缓存，如果命中则直接使用缓存（无服务器介入）
2. 如果没有命中强缓存，则发送请求到服务器检查是否命中协商缓存
3. 如果命中协商缓存，返回 304 以通知浏览器使用本地缓存
4. 都没有命中，则返回最新资源内容

## 浏览器缓存的资源存储方式

- MemoryCache：顾名思义，内存缓存。存储到内存中，命中的缓存资源从内存中直接获取，Webkit 早已支持。Webkit 中资源主要分两类：1.主资源，比如 HTML 页面、下载项；2.派生资源，比如 HTML 页面内嵌的图片或者脚本链接。

- DiskCache：顾名思义，磁盘缓存。存储到磁盘中，命中的缓存资源从磁盘中读取。

  MemoryCache VS DiskCache：

  共同点：都只能存储派生类资源（HTML 内嵌的图片、脚本链接等）

  不同点：

  - 退出进程时**清除** VS 退出进程时**不清除**
  - 存储脚本、字体、图片 VS 非脚本（如 CSS）

### 三级缓存原理

1. 首先查看内存，有则直接加载，没有则下一步
2. 查找磁盘（硬盘），有则加载，没有则下一步
3. 网络请求资源，下一步
4. 将请求到的资源缓存到内存或磁盘中。