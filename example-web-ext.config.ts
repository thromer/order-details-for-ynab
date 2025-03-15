// On Chromebooks it is easier to use the built-in browser.
//
// To avoid opening Chrome in the Linux environment, copy this to web-ext.config.ts.

import { defineRunnerConfig } from "wxt";

// Don't auto-open the browser.
export default defineRunnerConfig({
    disabled: true,
});
