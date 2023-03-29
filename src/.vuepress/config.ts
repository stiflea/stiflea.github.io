import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import { getDirname, path } from "@vuepress/utils";
// @ts-ignore
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
  base: "/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "窒息",
      description: "好风凭借力，送我上青云",
    }
  },
  theme,
  shouldPrefetch: false,
  alias: {
    "@MyComponent": path.resolve(__dirname, "MyComponent.vue"),
  }
});

