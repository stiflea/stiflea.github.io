import { sidebar } from "vuepress-theme-hope";

export const Sidebar = sidebar({
  "/": [
    "",
    {
      icon: "note",
      text: "文章",
      prefix: "notes",
      collapsible: true,
      children: "structure"
    }
  ],
});
