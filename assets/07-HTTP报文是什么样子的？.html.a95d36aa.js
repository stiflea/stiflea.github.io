import{_ as t}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as n,a as e,b as a,d as p,e as l,r}from"./app.4816587a.js";const o={},c=l(`<h1 id="http报文是什么样子的" tabindex="-1"><a class="header-anchor" href="#http报文是什么样子的" aria-hidden="true">#</a> HTTP报文是什么样子的？</h1><p>HTTP 协议基本工作流程，也就是「请求 - 应答」「一发一收」的模式。</p><p>可以看到，HTTP 的工作模式是非常简单的，由于 TCP/IP 协议负责底层的具体传输工作，HTTP 协议基本上不用在这方面操心太多。单从这一点上来看，所谓的「超文本传输协议」其实并不怎么管「传输」的事情，有点「名不副实」。</p><p>那么 HTTP 协议的核心部分是什么呢？</p><p>答案就是它传输的报文内容。</p><p>HTTP 协议在规范文档里详细定义了报文的格式，规定了组成部分，解析规则，还有处理策略，所以可以在 TCP/IP 层之上实现更灵活丰富的功能，例如连接控制，缓存管理、数据编码、内容协商等等。</p><h2 id="报文结构" tabindex="-1"><a class="header-anchor" href="#报文结构" aria-hidden="true">#</a> 报文结构</h2><p>TCP 报文来举例，它在实际要传输的数据之前附加了一个 20 字节的头部数据，存储 TCP 协议必须的额外信息，例如发送方的端口号、接收方的端口号、包序号、标志位等等。</p><p>有了这个附加的 TCP 头，数据包才能够正确传输，到了目的地后把头部去掉，就可以拿到真正的数据。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/174bb72bad50127ac84427a72327f095.png" alt="img" style="zoom:25%;"><p>HTTP 协议也是与 TCP/UDP 类似，同样也需要在实际传输的数据前附加一些头数据，不过与 TCP/UDP 不同的是，它是一个「纯文本」的协议，所以头数据都是 ASCII 码的文本，可以很容易地用肉眼阅读，不用借助程序解析也能够看懂。</p><p>HTTP 协议的请求报文和响应报文的结构基本相同，由三大部分组成：</p><ul><li>起始行（start line）：描述请求或响应的基本信息</li><li>头部字段集合（header）：使用 key-value 形式更详细地说明报文</li><li>消息正文（entity）：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据</li></ul><p>这其中前两部分起始行和头部字段经常又合称为「请求头」或「响应头」，消息正文又称为「实体」，但与「header」对应，很多时候就直接称为「body」。</p><p>TTP 协议规定报文必须有 header，但可以没有 body，而且在 header 之后必须要有一个「空行」，也就是「CRLF」，十六进制的「0D0A」。</p><p>所以，一个完整的 HTTP 报文就像是下图的这个样子，注意在 header 和 body 之间有一个「空行」。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/62e061618977565c22c2cf09930e1d3c.png" alt="img" style="zoom:25%;"><p>下面是一个请求报文的简单例子</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/b191c8760c8ad33acd9bb005b251a2df.png" alt="img" style="zoom:25%;"><p>在这个浏览器发出的请求报文里，第一行「GET / HTTP/1.1」就是请求行，而后面的「Host」「Connection」等等都属于 header，报文的最后是一个空白行结束，没有 body。</p><p>在很多时候，特别是浏览器发送 GET 请求的时候都是这样，HTTP 报文经常是只有 header 而没 body，相当于只发了一个超级「大头」过来。</p><p>不过这个「大头」也不能太大，虽然 HTTP 协议对 header 的大小没有做限制，但各个 Web 服务器都不允许过大的请求头，因为头部太大可能会占用大量的服务器资源，影响运行效率。</p><h3 id="请求行" tabindex="-1"><a class="header-anchor" href="#请求行" aria-hidden="true">#</a> 请求行</h3><p>了解了 HTTP 报文的基本结构后，我们来看看请求报文里的起始行也就是请求行（request line），它简要地描述了客户端想要如何操作服务器端的资源。</p><p>请求行由三部分构成：</p><ul><li>请求方法：是一个动词，如 GET/POST，表示对资源的操作</li><li>请求目标：通常是一个 URI，标记了请求方法要操作的资源</li><li>版本号：表示报文使用的 HTTP 协议版本。</li></ul><p>这三个部分通常使用空格（space）来分隔，最后要用 CRLF 换行表示结束。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/36108959084392065f36dff3e12967b9.png" alt="img" style="zoom:25%;"><p>比如说</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code><span class="token request-line"><span class="token method property">GET</span> <span class="token request-target url">/</span> <span class="token http-version property">HTTP/1.1</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在这个请求行里，「GET」是请求方法，「/」是请求目标，「HTTP/1.1」是版本号，把这三部分连起来，意思就是「服务器你好，我想获取网站根目录下的默认文件，我用的协议版本号是 1.1，请不要用 1.0 或者 2.0 回复我。」</p><p>别看请求行就一行，貌似很简单，其实这里面的「讲究」是非常多的，尤其是前面的请求方法和请求目标，组合起来变化多端。</p><h3 id="状态行" tabindex="-1"><a class="header-anchor" href="#状态行" aria-hidden="true">#</a> 状态行</h3><p>看完了请求行，我们再看响应报文里的起始行，在这里它不叫「响应行」，而是叫「状态行」（status line），意思是服务器响应的状态。</p><p>比起请求行来说，状态行要简单一些，同样也是由三部分构成：</p><ul><li>版本号：表示报文使用的 HTTP 协议版本</li><li>状态码：一个三位数，用代码的形式表示处理的结果，比如 200 是成功，500 是服务器错误</li><li>原因：作为数字状态码补充，是更详细的解释文字，帮助人理解原因。</li></ul><img src="https://static001.geekbang.org/resource/image/a1/00/a1477b903cd4d5a69686683c0dbc3300.png" alt="img" style="zoom:25%;"><p>比如说</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTP/1.1 200 OK
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>意思就是：「浏览器你好，我已经处理完了你的请求，这个报文使用的协议版本号是 1.1，状态码是 200，一切 OK。」</p><h3 id="头部字段" tabindex="-1"><a class="header-anchor" href="#头部字段" aria-hidden="true">#</a> 头部字段</h3><p>请求行或状态行再加上头部字段集合就构成了 HTTP 报文里完整的请求头或响应头</p><img src="https://static001.geekbang.org/resource/image/1f/ea/1fe4c1121c50abcf571cebd677a8bdea.png" alt="img" style="zoom:25%;"><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/cb0d1d2c56400fe9c9988ee32842b175.png" alt="img" style="zoom:25%;"><p>请求头和响应头的结构是基本一样的，唯一的区别是起始行，所以我把请求头和响应头里的字段放在一起介绍。</p><p>头部字段是 key-value 的形式，key 和 value 之间用「:」分隔，最后用 CRLF 换行表示字段结束。比如在「Host: 127.0.0.1」这一行里 key 就是「Host」，value 就是「127.0.0.1」。</p><p>HTTP 头字段非常灵活，不仅可以使用标准里的 Host、Connection 等已有头，也可以任意添加自定义头，这就给 HTTP 协议带来了无限的扩展可能。</p><p>不过使用头字段需要注意下面几点：</p><ul><li>字段名不区分大小写，例如「Host」也可以写成「host」，但首字母大写的可读性更好</li><li>字段名里不允许出现空格，可以使用连字符「-」，但不能使用下划线「_」。例如，「test-name」是合法的字段名，而「test name」「test_name」是不正确的字段名</li><li>字段名后面必须紧接着「:」，不能有空格，而「:」后的字段值前可以有多个空格</li><li>字段的顺序是没有意义的，可以任意排列不影响语义</li><li>字段原则上不能重复，除非这个字段本身的语义允许，例如 Set-Cookie。</li></ul><h3 id="常用头字段" tabindex="-1"><a class="header-anchor" href="#常用头字段" aria-hidden="true">#</a> 常用头字段</h3><p>HTTP 协议规定了非常多的头部字段，实现各种各样的功能，但基本上可以分为四大类：</p><ul><li>通用字段：在请求头和响应头里都可以出现</li><li>请求字段：仅能出现在请求头里，进一步说明请求信息或者额外的附加条件</li><li>响应字段：仅能出现在响应头里，补充说明响应报文的信息</li><li>实体字段：它实际上属于通用字段，但专门描述 body 的额外信息。</li></ul><p>对 HTTP 报文的解析和处理实际上主要就是对头字段的处理，理解了头字段也就理解了 HTTP 报文。</p><p>首先要说的是 Host 字段，它属于请求字段，只能出现在请求头里，它同时也是唯一一个 HTTP/1.1 规范里要求必须出现的字段，也就是说，如果请求头里没有 Host，那这就是一个错误的报文。</p><p>Host 字段告诉服务器这个请求应该由哪个主机来处理，当一台计算机上托管了多个虚拟主机的时候，服务器端就需要用 Host 字段来选择，有点像是一个简单的「路由重定向」。</p><p>User-Agent 是请求字段，只出现在请求头里。它使用一个字符串来描述发起 HTTP 请求的客户端，服务器可以依据它来返回最合适此浏览器显示的页面。</p><p>但由于历史的原因，User-Agent 非常混乱，每个浏览器都自称是「Mozilla」「Chrome」「Safari」，企图使用这个字段来互相「伪装」，导致 User-Agent 变得越来越长，最终变得毫无意义。</p><p>不过有的比较「诚实」的爬虫会在 User-Agent 里用「spider」标明自己是爬虫，所以可以利用这个字段实现简单的反爬虫策略。</p><p>Date 字段是一个通用字段，但通常出现在响应头里，表示 HTTP 报文创建的时间，客户端可以使用这个时间再搭配其他字段决定缓存策略。</p><p>Server 字段是响应字段，只能出现在响应头里。它告诉客户端当前正在提供 Web 服务的软件名称和版本号。</p><p>Server 字段也不是必须要出现的，因为这会把服务器的一部分信息暴露给外界，如果这个版本恰好存在 bug，那么黑客就有可能利用 bug 攻陷服务器。所以，有的网站响应头里要么没有这个字段，要么就给出一个完全无关的描述信息。</p>`,61),d={href:"http://GitHub.com",target:"_blank",rel:"noopener noreferrer"},h=e("p",null,[e("img",{src:"http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/img/f1970aaecad58fb18938e262ea7f311c.png",alt:"img",loading:"lazy"})],-1),m=e("p",null,"实体字段里要说的一个是 Content-Length，它表示报文里 body 的长度，也就是请求头或响应头空行后面数据的长度。服务器看到这个字段，就知道了后续有多少数据，可以直接接收。如果没有这个字段，那么 body 就是不定长的，需要使用 chunked 方式分段传输。",-1);function T(g,u){const i=r("ExternalLinkIcon");return s(),n("div",null,[c,e("p",null,[a("比如 GitHub，它的 Server 字段里就看不出是使用了 Apache 还是 Nginx，只是显示为「"),e("a",d,[a("GitHub.com"),p(i)]),a("」。")]),h,m])}const H=t(o,[["render",T],["__file","07-HTTP报文是什么样子的？.html.vue"]]);export{H as default};
