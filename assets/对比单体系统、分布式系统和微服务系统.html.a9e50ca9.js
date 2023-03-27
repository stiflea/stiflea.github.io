import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as i,a as p}from"./app.e93770df.js";const n={},r=p('<h1 id="对比单体系统、分布式系统和微服务系统" tabindex="-1"><a class="header-anchor" href="#对比单体系统、分布式系统和微服务系统" aria-hidden="true">#</a> 对比单体系统、分布式系统和微服务系统</h1><h2 id="单体系统之痛" tabindex="-1"><a class="header-anchor" href="#单体系统之痛" aria-hidden="true">#</a> 单体系统之痛</h2><p>单体系统并非一无是处。在某些场景中，单体系统是最佳的选择，可以帮助企业业务快速发展。</p><p>在企业初创期，投入较少的研发资源构建出；适应当前业务的单体应用，从而达到抢占市场和技术试错的目的。</p><h3 id="什么是单体系统" tabindex="-1"><a class="header-anchor" href="#什么是单体系统" aria-hidden="true">#</a> 什么是单体系统</h3><p>单体系统即一个应用程序，所有的业务代码都在这一个应用程序中，所有的表也都在一个数据库中，所涉及的相关文件都在同一个服务器上。</p><p>在企业初创期，为了快速进入市场，一般企业都采用单体系统。淘宝等电商平台在初创期也都采用的是单体系统。</p><p>在企业初创期，用户量不多，业务场景也不复杂，这正是验证技术和业务模式可行性之时，系统越简单越好，搭建过程越快越好。于是，可以在同一台服务器上构建 “1 个应用程序 ＋ 1 个数据库 ＋1个文件服务器” 的单体系统，如图所示</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230324231052182.png" alt="image-20230324231052182" style="zoom:50%;"><h3 id="单体系统面临的问题" tabindex="-1"><a class="header-anchor" href="#单体系统面临的问题" aria-hidden="true">#</a> 单体系统面临的问题</h3><p>企业快速发展后，单体系统可能会面临以下问题：</p><ul><li>需要频繁地合并代码分支，影响项目的迭代进度。</li><li>多人协作糯合度高，测试效率低下。</li><li>开发节奏混乱，代码冲突频繁。</li><li>代码模块层次越来越复杂，业务边界变得不清晰。</li><li>项目越来越庞大，技术架构升级变得困难。</li></ul><p>此时如果需要迭代系统版本或上新一个业务板块，则会涉及系统的多个业务。</p><p>例如，对于一个产品需求，可能会拉取多个分支 (feature/A 和 feature/B）进行开发。在开发feature/B 过程中，由于业务需要修改了部分功能，这部分功能涉及 featurelA 的功能，然后进行测试，也通过测试了。在之后开发feature/A 过程中进行代码拉取及合并时，可能会出现各种代码沖突，这就需要花费大量的沟通成本去解決。</p><p>项目的参与人员越多，则代码冲突的概率就越大。如果没有版本规划管理，那么这种低效的开发方式会严重阳塞产品版本迭代。</p><p>单体系统一般采用三层架构，如图所示：</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230324232031138.png" alt="image-20230324232031138" style="zoom:50%;"><p>单体系统架构分层也有弊端：</p><ul><li>从水平方向来看，的确降低了业务的深度复杂性。</li><li>从垂直方向来看，单体的业务边界不够清晰，因为在各层之问会进行网状的调用，比如，用户展现层的某个模块会调用业务层的多个模块（甚至所有的模块）；业务层的模块同样会调用数据访问层的多个模块等。</li></ul><p>在业务稍微复杂的场景下，单体架构的模块只是在逻拜上是独立的，在物理上并没有分开，模块之间的依赖关系比较混乱。</p><p>通过上面的内容我们可以知道，单体项目当前的代码量已经非常庞大了，而且开发沟通成本也很大，业务模块的调用也异常复杂。</p><p>如果单体应用使用了很多的技术，且其中部分技术比较落后，则我们一般不愿意升级该单体应用，因为升级的成本很大：要考虑整个系统的所有引用方是否有问题；要验证当前架构的适应度；即使强制升级了，还需要花费大量的时间进行全盘测试验证，灰度发布一段时间后才能正常使用。</p><h2 id="高并发系统之分布式架构" tabindex="-1"><a class="header-anchor" href="#高并发系统之分布式架构" aria-hidden="true">#</a> 高并发系统之分布式架构</h2><p>正因为单体系统存在上述的诸多问题，所以，企业在发展到一定阶段后需要对应用进行拆分，即将单体架构改为分布式架构。</p><h3 id="什么是分布式架构" tabindex="-1"><a class="header-anchor" href="#什么是分布式架构" aria-hidden="true">#</a> 什么是分布式架构</h3><p>分布式架构是指，将相同或者相关的应 用放在多台计算机上运行，以达到分布式计算的目的。</p><p>通俗来讲，分布式架构就是将一个系统拆分为多个独立的应用，然后它们互相协作，组成一个整体，共同完成任务。</p><p>分布式架构用来解决单体系统复杂的痛点。</p><p>早期的分布式架构就是将应用程序、文件及数据库从原有的单台服务器部署到多台不同的服务器。</p><p>分布式架构是包含了多个应用的架构，其中每个应用对应一个独立的业务线。如果其中一个应用需要和另一个应用进行交互，则可以通过对方提供的 API 来进行交互。</p><p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230324232748244.png" alt="image-20230324232748244" loading="lazy"></p><h3 id="分布式架构的局限性" tabindex="-1"><a class="header-anchor" href="#分布式架构的局限性" aria-hidden="true">#</a> 分布式架构的局限性</h3><p>分布式架构也有局限性，例如：</p><ul><li>开发者在开发应用时，需要考虑当前应用的 API 模块。因为，如果因为业务需要更改了相关底层逻辑，则这种修改会影响 API模块，所以需要对 API 模块也进行对应逻辑的修改，否则已经在调用的服务会出现调用错误，影响线上产品。</li><li>外部的服务 需要依据自己的业务向服务提供方提出相应的小需求。服务提供方可能只是改动了 API 模块，但是从整体来说则需要测试并重新部署一遍，影响服务的稳定性。</li></ul><p>在分布式架构下，很可能出现很多业务功能的重复开发，即所谓的“重复造轮子”造成开发资源的浪费。</p><p>由此可见，分布式架构系统更适合与业务关联性低、聘合少的业务系统。例如，企业的内部管理系统（如进销存系统和 CRM 系统）适合搭建成分布式架构。</p><h2 id="高并发系统之微服务架构" tabindex="-1"><a class="header-anchor" href="#高并发系统之微服务架构" aria-hidden="true">#</a> 高并发系统之微服务架构</h2><p>正因为分布式架构存在上述的局限性，所以，需要对分布式架构进行审视和优化，业务边界进行更细颗粒度的划分（即微服务架构）。</p><h3 id="理解微服务架构" tabindex="-1"><a class="header-anchor" href="#理解微服务架构" aria-hidden="true">#</a> 理解微服务架构</h3><p>微服务是一种流行的架构设计风格。微服务的概念最早在 2014 年由 Martin Fower 和 James Lewis 共同提出。他们定义了以下内容：</p><ul><li>微服务是由单一应用构成的小型服务，拥有自己的进程与轻量化处理。</li><li>微服务依据业务功能设计，以全自动的方式部署，与其他微服务使用 HTTP API 进行通信。</li><li>微服务会使用最小规模的集中管理技术，例如 Docker。</li><li>微服务可以使用不同的编程语言和数据库。</li></ul><p>〝微服务系统”是相对“单体系统”而言的，因为单体系统在面临复杂业务时显得有点无力。</p><p>微服务系统就是将复杂的单体系统中的模块按照某种规则进行拆分，这些被拆分出来的模块被独立部署在相对较小的服务器集群上。独立部署的模块彼此之间使用远程调用的方式来完成整个业务的处理。这些被独立部署的模块就是微服务，而这样的应用架构就是微服务架构。</p><p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230324233540344.png" alt="image-20230324233540344" loading="lazy"></p><p>上图展示了微服务架构和单体架构在扩展及模块划分方面的区别。</p><ul><li>外部的边框代表应用的边界，不同的形状代表不同的模块。</li><li>左侧为单体系统架构，所有的模块都在一个应用内。</li><li>右侧为微服务架构，每个模块在自己的应用边界内。</li></ul><p>左侧的单体应用在扩展时，是采用整体应用扩展的方式；右侧的微服务架构在扩展时，采用的是以服务为单位的扩展方式。</p><p>通过上图我们能清晰地感受到微服务 架构的灵活性，这样我们就可以将系统内的校心业务逻辑和数据拆分出来整理为微服务。</p><p>例如,将系统底层的基础业务封装为共享微服务,将对外的逻辑编排封装成聚合微服务，将具体业务处理的部分封装成应用微服务，将基础中间件（如消息队列、缓存以及消息推送等）封装成基础微服务</p><p>这些微服务在具体落地时，需要采用去中心化的方式，并且使用轻量级的通信框架，最后将它们打造成技术上轻量级、功能上细分的独立微服务。</p><p>基于以上思路，我们能很容易地构建出微服务，并在此基础上像搭积木那祥来搭建各种微服务，形成一个大系统。这样搭建出来的系统更具有弹性且扩展性更强。</p><p>我们需要对微服务的依赖关系进行有效的管理，打造一个有序的微服务体系。否则，微服务会杂乱无章，整个系统会无规律且不清晰，难以维护和扩展。一个有序的服务体系应该是下图这样的——依赖关系清晰有序。</p><p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230324235312558.png" alt="image-20230324235312558" loading="lazy"></p><h3 id="微服务特征" tabindex="-1"><a class="header-anchor" href="#微服务特征" aria-hidden="true">#</a> 微服务特征</h3><p>搭建微服务架构呢，不同的人可能会有不同的理解，并没有统一的定义。那我们应该依据什么去搭建微服务呢？应该去观察微服务架构所具备的特征，这些特征可以帮我吗确定选择何种微服务架构。</p><h4 id="通过服务实现组件化" tabindex="-1"><a class="header-anchor" href="#通过服务实现组件化" aria-hidden="true">#</a> 通过服务实现组件化</h4><p>软件行业一直期望通过拼插第三方组件的方式来搭建软件系统，即实现组件可插拔。在 Java 应用开发中，这种第三方组件通常是以 JAR 文件的形式出现的，Maven 仓库就提供了海量的第三方组件。</p><p>这种组件化的软件搭建方式就是将完整的系统分解为服务。这些服务独立运行在进程中，它们通过类似于 HTTP 这样的进程问的通信方式或者通过远程调用通信的方式进行通信。</p><p>把服务当作组件来使用的一个主要原因是服务能够独立部署。在使用 API 规范来描述服务接口后，一个服务只能通过 API 的方式来访问另一个服务，但是无法访问服务的内部函数。服务之间的调用关系如下图所示，调用方式可以是 REST 方式，也可以是 RPC 方式。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230325000011797.png" alt="image-20230325000011797" style="zoom:50%;"><h4 id="围绕业务能力来组织开发团队" tabindex="-1"><a class="header-anchor" href="#围绕业务能力来组织开发团队" aria-hidden="true">#</a> 围绕业务能力来组织开发团队</h4><p>单体系统的开发团队通常是按照技能标准来划分的。例如，分为前端组、服务端组及数据库组等，这样的组是被垂直分割的，如下图所示。即使一个小需求的改动都需要进行跨组的沟通，这是不利于项日正常发展的。</p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230325000346189.png" alt="image-20230325000346189" style="zoom:67%;"><p>微眼多系练开发团队是国绕着业务能力来划分的，一个服务相当于一个小应用，对应着一个街定的业务需求。开发团队规模钱小，包含开发人员、测试人员及运维人员等。负责该微服务的团以全权负责该微服务的所有需求实现与改动。这样的好处是：沟通成本小，开发效率高。</p><p>这种划分方式主要依据业务需求，旦技术栈灵活，包括用户界面、持续存储，以及任意的外部协作。因此，这些组之间是路功能的，包括开发所要求的所有技能，例如：前端用户体验、数据库和项目管理。</p><h4 id="去中心化管理" tabindex="-1"><a class="header-anchor" href="#去中心化管理" aria-hidden="true">#</a> 去中心化管理</h4><p>单体系统的开发团以一般采用统一的技术栈，这种单一的技术栈在具休实施过程中会有很多局限性，因为没有一种技能解决企业所有的回题。在特定场景下，单体应用能多发挥不同语言的优势，但这并不常见。</p><p>在微服务架构中，服务都是独立开发旦独立部署的。所以在开发时，对于每个服务都可以选择最适合的技术栈，只需要定义好 API 契约即可。例如，使用 Node.js 搭建单个报告页面;使用 C++做一些基础服务（如人脸识别 Al 工程服务等）。</p><p>Netfix 就是这种理念的践行者。它通过库的形式共享有用的、经过时间考验的代码，鼓励其他开发者以相似方法解决相似问题。这种共享库的形式通常可以解决一些通用的问题，比如数据存储、进程间通信，以及基础设施自动化。</p><p>每个团队负责自己团队内部的服务：负责服务开发、服务构建、服务测试及服务部署运维等工作，这在无形中提高了团队的主观能动性，开发人员归属感更强，也降低了管理的成本。</p><h4 id="去中心化数据存储" tabindex="-1"><a class="header-anchor" href="#去中心化数据存储" aria-hidden="true">#</a> 去中心化数据存储</h4><p>单体架构通常采用单一逻辑的数据库进行集中的数据存储，通常这种单一逻辑的数据库（例如 Oracle）的成本较高，且在面对复杂业务时很难进行弹性伸缩。</p><p>而微服务架构倾向于让每个服务管理自己的数据库（如图下图所示），利用多个较低成本的数据库达到去中心化数据存储的目的，可以更好地应对复杂业务。</p><p><img src="http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230325001457319.png" alt="image-20230325001457319" loading="lazy"></p><h4 id="基础设施自动化" tabindex="-1"><a class="header-anchor" href="#基础设施自动化" aria-hidden="true">#</a> 基础设施自动化</h4><p>单体应用由于所有代码都在一个项目中，部署时只有一个部署包，部署很方便，所以，它对自动化的要求并不是很高。</p><p>在微服务架构中，所有的服务都是独立部署的。当服务数量很大时，如果还是像单体应用那样进行人工部署，则效率会非常低，所以，微服务架构必须要通过自动化的方式来部署。现在，持续集成及持续部署都是最通用的实践了。</p><h4 id="充分考虑故障" tabindex="-1"><a class="header-anchor" href="#充分考虑故障" aria-hidden="true">#</a> 充分考虑故障</h4><p>微服多之间是通过进程间通信进行交互的，这样的交互方式天然就容易失败。因此，做服务不一定就是“银弹”，微服务架构也不是解決所有应用问题的万能钥匙。</p><h3 id="微服务架构的问题" tabindex="-1"><a class="header-anchor" href="#微服务架构的问题" aria-hidden="true">#</a> 微服务架构的问题</h3><p>总的来说，微服务架构会带来以下问题。</p><p><strong>增加了复杂度</strong></p><p>从单个应用演变到多个应用，不仅会带来服务数量的增加，也会带来交互模式的变更。</p><p><strong>服务间的通信会变得复杂</strong></p><p>引入微服务架构后，系统变成了一个分布式系统。在分布式系统中，应用之间是通过进程进行通信的，例如采用 REST 或 RPC 框架调用的方式进行通信。这种通信方式要求调用端需要有完善的策略以应对服务调用不成功的情況，因为服务调用者先得明确知道服务提供者具体部署在哪台机器，然后找到对应的机器进行通信。同时，如果服务提供者出现异常或宕机，则服务调用者如何实时感知等是很复杂的。</p><p><strong>在落地微服务时，微服务边界的划分增加了实现的复杂度</strong></p><p>微服务边界划分是微服务设计的难点，划分的好坏直接决定着整个微服务架构的好坏，会影响整个产品的推进进度：</p><ul><li>如果服务颗粒度划分得过粗，则随着业务复杂度的上升，系统又会是一个庞大的单体应用。</li><li>如果服务颗粒度划分得过细，则会出现数量很多的服务，这样会增加服务运维及监控的成本，过多的服务会使得调用链变得复杂，直接影响整个系统的性能。在划分完一段时间后，如果觉得不合适，则重组服务的工作量巨大且风险很大。</li></ul><p><strong>保持数据一致性非常复杂</strong></p><p>微服务架构中的服务可能使用的是不同的数据库，包括关系型数据库和非关系型数据库，要在这些数据库之问保持数据一致性是非常复杂的。</p><p>在单体应用中，需要通过数据库事务的 ACID 特性来保证数据一致性；而在微服务架构中，通常需要保证数据的最终一致性。</p><p><strong>对运维团队和开发团队都提出了更高的要求</strong></p><p>因为每个服务都有自己的实现方式，目服务数量很多，所以，运维团队不仅需要维护种类紫多的数据库和消息中间件，还需要应对持续集成和特续都署的挑战；开发团队需要具备微服务开发经验，开发人员的成本会随之提高。</p><p>现在出现了很多的云平台，以及 Kubernetes 和 Docker 等技术，运维团队可以更好地管理微服务。</p><p><strong>开发流程复杂</strong></p><p>建议将微服务架构的团队按照服务来划分团队，每个团队负责一个或多个微服务的开发、测试、构建及运维等。但是在开发流程上，瀑布式的开发流程并不适用于微服务开发，微服务开发应该采用敏捷软件开发流程。</p><p>如上，我们知道了微服务架构会给开发带来一些复杂性。所以，我们要真正地理解微服务的各种特征，只有理解透了，在落地时才不会出现各种错误。</p>',97),t=[r];function h(s,d){return e(),i("div",null,t)}const c=a(n,[["render",h],["__file","对比单体系统、分布式系统和微服务系统.html.vue"]]);export{c as default};
