import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import fs from "fs";
import path from "path";

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync(
                path.resolve(__dirname, "certs/traffic.keeping.work.key")
            ),
            cert: fs.readFileSync(
                path.resolve(__dirname, "certs/traffic.keeping.work.crt")
            ),
        },
        host: "localhost.keeping.work",
        port: 5173,
        public: "https://localhost.keeping.work:5173",
    },
    plugins: [
        laravel({
            input: [
                "resources/css/traffic-light.css",
                "resources/css/app.css",
                "resources/js/traffic-light.js",
                "resources/js/app.js",
                "resources/js/traffic-light-settings.js",
                "resources/js/traffic-light-create.js",
                "resources/js/traffic-light-edit.js",
                "node_modules/bootstrap/dist/css/bootstrap.min.css",
            ],
            refresh: true,
        }),
    ],
});
