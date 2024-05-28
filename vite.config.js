import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,
    },
    plugins: [
        laravel({
            input: [
                "resources/css/traffic-light.css",
                "resources/js/traffic-light.js",
                "resources/css/app.css",
                "resources/js/traffic-light-settings.js",
                "resources/js/traffic-light-create.js",
                "resources/js/traffic-light-edit.js",
                "node_modules/bootstrap/dist/css/bootstrap.min.css",
            ],
            refresh: true,
        }),
    ],
});
