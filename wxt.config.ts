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
        permissions: ["identity"],
        oauth2: {
            client_id:
                "918182531435-fjfb7pouahupkm1cdluqpsdut4hak6ti.apps.googleusercontent.com",
            scopes: ["https://www.googleapis.com/auth/userinfo.email"],
        },
        key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyPFRlQDuwKFui3oNFTfZ6ozOu0hU1DOZbUfLbdiuw5tbCtctl4Oek2GoC5n1qN4R+d4mb6da//E+W54/gpogt7egHEf3J6ceRmKM2ZiGh98cSskTT8igRGqa5+DsiQopR90oeyJ8Z+dxLeizLAAIwag7ZS9Jhkb3w8D7NtLYgJcMOzAyyhgyeggZ5tHR/M3hx2IvLlAqxKxhkWxVr0x+xc2B4a6+DPwckjDRshLKldbfQv9FWW6bdvNTDvapRtbwiyR3KQpR0Z+VxKxNaTUOhhE1YiFH7SM0sNhVfw1g7dF3BBl84q3Y+LycqAocHUfrrKEtoEKOac2VQ02kZTs36QIDAQAB",
    },
});
