import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: "chrome",
    modules: ["@wxt-dev/module-react"],
    manifestVersion: 3,
    manifest: {
        homepage_url: "https://github.com/thromer/order-details-for-ynab",
        developer: {
            name: "Theodore Romer",
        },
    },
});
