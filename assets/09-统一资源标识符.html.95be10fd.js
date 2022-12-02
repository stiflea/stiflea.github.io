import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as p,c as a,e as i}from"./app.4816587a.js";const t={},r=i(`<h1 id="统一资源标识符" tabindex="-1"><a class="header-anchor" href="#统一资源标识符" aria-hidden="true">#</a> 统一资源标识符</h1><p>HTTP 协议有许多请求方法，其中最常用的一个是 GET，它用来从服务器上某个资源获取数据，另一个是 POST，向某个资源提交数据。</p><p>那么，应该用什么来标记服务器上的资源呢？怎么区分「这个」资源和「那个」资源呢？</p><p>URI，也就是统一资源标识符（Uniform Resource Identifier）。因为它经常出现在浏览器的地址栏里，所以俗称为「网络地址」，简称「网址」。</p><p>严格地说，URI 不完全等同于网址，它包含有 URL 和 URN 两个部分，在 HTTP 世界里用的网址实际上是 URL——统一资源定位符（Uniform Resource Locator）。但因为 URL 实在是太普及了，所以常常把这两者简单地视为相等。</p><p>不仅我们生活中的上网要用到 URI，平常的开发、测试、运维的工作中也少不了它。</p><p>如果你在客户端做 iOS、 Android 或者某某小程序开发，免不了要连接远程服务，就会调用底层 API 用 URI 访问服务。</p><p>如果你使用 Java、PHP 做后台 Web 开发，也会调用 getPath()、parse_url() 等函数来处理 URI，解析里面的各个要素。</p><p>在测试、运维配置 Apache、Nginx 等 Web 服务器的时候也必须正确理解 URI，分离静态资源与动态资源，或者设置规则实现网页的重定向跳转。</p><p>总之一句话，URI 非常重要，要搞懂 HTTP 甚至网络应用，就必须搞懂 URI。</p><h2 id="uri-的格式" tabindex="-1"><a class="header-anchor" href="#uri-的格式" aria-hidden="true">#</a> URI 的格式</h2><p>URI 本质上是一个字符串，这个字符串的作用是唯一地标记资源的位置或者名字。</p><p>它不仅能够标记万维网的资源，也可以标记其他的，如邮件系统、本地文件系统等任意资源。而「资源」既可以是存在磁盘上的静态文本、页面数据，也可以是由 Java、PHP 提供的动态服务。</p><p>下面的这张图显示了 URI 最常用的形式，由 scheme、host:port、path 和 query 四个部分组成，但有的部分可以视情况省略。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/46581d7e1058558d8e12c1bf37d30d2a.png" alt="img" style="zoom:33%;"><h2 id="uri-的基本组成" tabindex="-1"><a class="header-anchor" href="#uri-的基本组成" aria-hidden="true">#</a> URI 的基本组成</h2><p>URI 第一个组成部分叫 scheme，翻译成中文叫「方案名」或者「协议名」，表示资源应该使用哪种协议来访问。</p><p>最常见的当然就是「http」了，表示使用 HTTP 协议。另外还有「https」，表示使用经过加密、安全的 HTTPS 协议。此外还有其他不是很常见的 scheme，例如 ftp、ldap、file、news 等。</p><p>浏览器或者你的应用程序看到 URI 里的 scheme，就知道下一步该怎么走了，会调用相应的 HTTP 或者 HTTPS 下层 API。显然，如果一个 URI 没有提供 scheme，即使后面的地址再完善，也是无法处理的。</p><p>在 scheme 之后，必须是三个特定的字符「😕/」，它把 scheme 和后面的部分分离开。</p><p>实话实说，这个设计非常的怪异。URI 的创造者蒂姆·伯纳斯 - 李也曾经私下承认「😕/」并非必要，当初有些「过于草率」了。</p><p>不过这个设计已经有了三十年的历史，不管我们愿意不愿意，只能接受。</p><p>在「😕/」之后，是被称为「authority」的部分，表示资源所在的主机名，通常的形式是「host:port」，即主机名加端口号。</p><p>主机名可以是 IP 地址或者域名的形式，必须要有，否则浏览器就会找不到服务器。但端口号有时可以省略，浏览器等客户端会依据 scheme 使用默认的端口号，例如 HTTP 的默认端口号是 80，HTTPS 的默认端口号是 443。</p><p>有了协议名和主机地址、端口号，再加上后面标记资源所在位置的 path，浏览器就可以连接服务器访问资源了。</p><p>URI 里 path 采用了类似文件系统「目录」「路径」的表示方式，因为早期互联网上的计算机多是 UNIX 系统，所以采用了 UNIX 的「/」风格。其实也比较好理解，它与 scheme 后面的「😕/」是一致的。</p><p>URI 的 path 部分必须以「/」开始，也就是必须包含「/」，不要把「/」误认为属于前面 authority。说了这么多「理论」，来看几个实例。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>http://nginx.org
http://localhost/11-1
https://tools.ietf.org/html/rfc7230
file:///D:/http_study/www/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于 HTTP 或 HTTPS 这样的网络通信协议，主机名是绝对不能省略的。原因之前也说了，会导致浏览器无法找到服务器。</p><h2 id="uri-的查询参数" tabindex="-1"><a class="header-anchor" href="#uri-的查询参数" aria-hidden="true">#</a> URI 的查询参数</h2><p>使用「协议名 + 主机名 + 路径」的方式，已经可以精确定位网络上的任何资源了。但这还不够，很多时候我们还想在操作资源的时候附加一些额外的修饰参数。</p><p>举几个例子：获取商品图片，但想要一个 32×32 的缩略图版本；获取商品列表，但要按某种规则做分页和排序；跳转页面，但想要标记跳转前的原始页面。</p><p>仅用「协议名 + 主机名 + 路径」的方式是无法适应这些场景的，所以 URI 后面还有一个「query」部分，它在 path 之后，用一个「?」开始，但不包含「?」，表示对资源附加的额外要求。这是个很形象的符号，比「😕/」要好的多，很明显地表示了「查询」的含义。</p><p>查询参数 query 有一套自己的格式，是多个「key=value」的字符串，这些 KV 值用字符「&amp;」连接，浏览器和服务器都可以按照这个格式把长串的查询参数解析成可理解的字典或关联数组形式。</p><h2 id="uri-的完整格式" tabindex="-1"><a class="header-anchor" href="#uri-的完整格式" aria-hidden="true">#</a> URI 的完整格式</h2><p>讲完了 query 参数，URI 就算完整了，HTTP 协议里用到的 URI 绝大多数都是这种形式。</p><p>不过必须要说的是，URI 还有一个「真正」的完整形态，如下图所示。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/ff41d020c7a27d1e8191057f0e658b38.png" alt="img" style="zoom:33%;"><p>这个「真正」形态比基本形态多了两部分。</p><p>一个多出的部分是协议名之后、主机名之前的身份信息「user:passwd@」，表示登录主机时的用户名和密码，但现在已经不推荐使用这种形式了（RFC7230），因为它把敏感信息以明文形式暴露出来，存在严重的安全隐患。</p><p>第二个多出的部分是查询参数后的片段标识符「#fragment」，它是 URI 所定位的资源内部的一个「锚点」或者说是「标签」，浏览器可以在获取资源后直接跳转到它指示的位置。</p><p>但片段标识符仅能由浏览器这样的客户端使用，服务器是看不到的。也就是说，浏览器永远不会把带「#fragment」的 URI 发送给服务器，服务器也永远不会用这种方式去处理资源的片段。</p><h2 id="uri-的编码" tabindex="-1"><a class="header-anchor" href="#uri-的编码" aria-hidden="true">#</a> URI 的编码</h2><p>在 URI 里只能使用 ASCII 码，但如果要在 URI 里使用英语以外的汉语、日语等其他语言该怎么办呢？</p><p>还有，某些特殊的 URI，会在 path、query 里出现「@&amp;?&quot;等起界定符作用的字符，会导致 URI 解析错误，这时又该怎么办呢？</p><p>所以，URI 引入了编码机制，对于 ASCII 码以外的字符集和特殊字符做一个特殊的操作，把它们转换成与 URI 语义不冲突的形式。这在 RFC 规范里称为「escape」和「unescape」，俗称「转义」。</p><p>URI 转义的规则有点「简单粗暴」，直接把非 ASCII 码或特殊字符转换成十六进制字节值，然后前面再加上一个「%」。</p><p>例如，空格被转义成「%20」，「?」被转义成「%3F」。而中文、日文等则通常使用 UTF-8 编码后再转义，例如「银河」会被转义成「%E9%93%B6%E6%B2%B3」。</p><p>有了这个编码规则后，URI 就更加完美了，可以支持任意的字符集用任何语言来标记资源。</p>`,49),s=[r];function h(n,d){return p(),a("div",null,s)}const u=e(t,[["render",h],["__file","09-统一资源标识符.html.vue"]]);export{u as default};
