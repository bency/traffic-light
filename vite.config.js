import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/traffic-light.css",
                "resources/js/traffic-light.js",
            ],
            refresh: true,
        }),
    ],
});
