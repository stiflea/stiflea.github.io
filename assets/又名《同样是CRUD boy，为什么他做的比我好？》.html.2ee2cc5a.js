import{_,o as p,c as o,a as e}from"./app.f4b83dc6.js";const c={},t=e('<p>首先要说明的是，这本书没有介绍什么新技术，很多内容都是我们所熟悉的。也没有具体讲解某一种技术的细节，不能期望读完本书后成为某种专家。</p><p>本书的意义在于，一方面是百科全书式的广度科普，涉及大家耳熟能详的技术名词：NoSQL, 大数据，最终一致性，CAP，MapReduce，流处理等，讨论他们背后遵循的不变的原则，知晓这些技术做的取舍，探索它们的设计选择。帮助我们更好地使用这些技术，不仅知道how，更加知道why。对我们有经验的工程师来说，可以查漏补缺，完善知识图谱上的拼图。</p><p>另一方面是思想深度上的升华。我们虽然有一定的开发经验，掌握了一些知识和技巧，但这些知识在我们的头脑中是比较散乱的，没有很好的组织起来，点和点之间也没产生联系。这本书就是将各个知识点串联起来，我们可以看到，同一种思想在多个章节中出现，反映出这些各种技术本质上是某种思想在不同问题层面上的投射。让我们能够站在一个高度上审视，自己的工作本质上是在做什么事，是在何种假设下解决什么类型的问题，得以从繁多的技术细节中抬起头来，看一看知识体系的全貌。</p><p>这本书还有一个优点，把复杂的东西简单化，之前总也搞不明白的概念，看了这本书就懂了。</p><p>个人认为本书揭示的最深刻的洞见：</p><ol><li>几乎所有的后端系统都是以数据为中心的，应用代码其实说到底只做两件事：查询数据返回给请求方；将数据从一处搬运到另一处。这也是为什么我们总摆脱不了CRUD boy的调侃。我们做的事情几乎逃不出本书的范畴。</li><li>我们工作之所以复杂，是因为没有任何一种数据模型是能够满足所有人需要的，因为每个人拥有不同的视角（view），因此一份数据必须衍生出多个不同形式的副本，本质上是对不同视角的查询优化，而数据间的同步就带来了延时问题，一致性问题。另一方面，从可用性和可扩展性上来看，单点数据也应该被避免，应该使用备份和分区，这同样带来了延时与一致性问题。我们工作中的挑战主要也是来自于这两点。</li></ol><p><img src="https://docs-images.oss-cn-beijing.aliyuncs.com/ddia/又名《同样是CRUD boy，为什么他做的比我好？》/img.png" alt="img.png" loading="lazy"></p><p>应用代码负责维护各个数据库间数据的同步，对外打造一个统一的数据系统（截自本书）</p><p>全书脉络清晰，分为三个部分：</p><p>第一部分介绍数据相关的基本思想，包括如何评价一个数据库（第一章），数据在逻辑上如何组织（第二章），在磁盘中如何分布（第三章），在表现上如何编码（第四章）。这些思想是一个数据系统的基本，无论它是单机的，还是分布式的。</p><p>第二部分介绍分布式环境下的技术，包括复制（第五章）、分区（第六章）、分布式事务与共识（第七、八、九章）。这些技术大多是基于同构系统的，分布式事务虽然也能在异构系统中应用，但是复杂度要高很多。</p><p>第三部分介绍异构系统中数据的处理技术，包括批处理（第十章）和流处理（第十一章），最后提出一种以流处理为主的异步数据处理方案，有可能在日后成为构建应用的主流方案（第十二章）。</p>',12),i=[t];function s(a,l){return p(),o("div",null,i)}const r=_(c,[["render",s],["__file","又名《同样是CRUD boy，为什么他做的比我好？》.html.vue"]]);export{r as default};
