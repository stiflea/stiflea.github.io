import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "陈清华的物料阁",
      description: "好风凭借力，送我上青云",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "陈清华的物料阁",
      description: "好风凭借力，送我上青云",
    },
  },

  theme,

  shouldPrefetch: false,
});
