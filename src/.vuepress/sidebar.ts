import { sidebar } from "vuepress-theme-hope";

export const Sidebar = sidebar({
  "/": [
    "",
    // "intro",
    // "vuepress-doc",
    {
      icon: "repo",
      text: "杂谈",
      prefix: "post",
      children: "structure"
    },
    {
      icon: "note",
      text: "文章",
      prefix: "notes",
      collapsible: true,
      children: "structure"
    },
    {
      icon: "read",
      text: "存档",
      prefix: "arch",
      collapsible: true,
      children: "structure"
    }
  ],
});
