import { defineClientConfig } from "@vuepress/client";
import WaterMark from "./components/WaterMark.vue";

export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
        app.component("WaterMark", WaterMark);
    },
});