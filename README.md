# 窒息

这里是窒息群的共享知识库，我是处长。

本项目使用了 vuepress 作为框架，可以自动解析 Markdown 文件并渲染成页面，如果你想要在本地运行，需要你懂一点 node.js（其实也不需要太懂），或者直接参照我们使用的主题的官网：[主页 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/)，里面有很详尽的配置和教程。

当然如果你你不想这么麻烦，可以不用在本地运行项目，直接在 note 目录下写你的 Markdown 就好。框架会自动解析。

![image-20230326214001595](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326214001595.png)

## 关于提交流程

- git fork 到自己的仓库
- git clone 到本地
- 愉快地编写你的 markdown
- 推送到自己的远程库
- 去自己的仓库提交 pull request
  - ![image-20230326214500789](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326214500789.png)
- 私信处长
- 等待处长审核通过 merge 后 GitHub 会自动打包部署到网站了
- 如果没有看到自己新提交的文章，打开 F12 ，清空一下页面缓存
  - ![image-20230326214847045](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326214847045.png)

## 关于提交的文件

最好只提交 markdown 文件，如果你参考了[主页 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/)后看到了有不错的配置，可以私信处长修改。

## 关于 Markdown 配置

框架会对 Markdown 进行增强渲染，你可以在你的 Markdown 文件中配置相关信息。

推荐配置以下信息

![image-20230326215509649](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326215509649.png)

## 关于 Markdown 内容

由于框架解析，如果你的 Markdown 文件中包含了尖括号 < > ，例如：

![image-20230326234019858](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326234019858.png)

会导致解析异常，导致打包失败。需要你通过增加 \ 来回避这个 BUG，例如：

![image-20230326234327849](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/note/image-20230326234327849.png)

## 关于提交规范

- 请不要以自己的名字作为目录
- 请在提交时使用合适的 message，减少处长的压力。
- 请尽量不要提交 demo 文件
- 如果是第一次提交，还是建议尝试在本地运行一下，如果没有出错再进行提交，GitHub 每个月的免费自动构建是有额度的，尽量不要浪费资源
- 如果精力允许，写文章时尽量参考 [中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)，良好的规范促进我们共同进步。

## 关于图床

你的图片需要存到自己的图床，推荐使用 OSS 或者 GitHub 新建一个仓库。如果没有，可以私信群主，使用群主图床。

