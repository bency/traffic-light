import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/traffic-light.css",
                "resources/js/traffic-light.js",
                "resources/css/app.css",
                "resources/js/traffic-light-settings.js",
                "node_modules/bootstrap/dist/css/bootstrap.min.css",
            ],
            refresh: true,
        }),
    ],
});
