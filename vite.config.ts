import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    "ui-vendor": [
                        "@radix-ui/react-alert-dialog",
                        "@radix-ui/react-checkbox",
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-label",
                        "@radix-ui/react-navigation-menu",
                        "@radix-ui/react-popover",
                        "@radix-ui/react-select",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slot",
                        "@radix-ui/react-tabs",
                        "@radix-ui/react-tooltip",
                        "framer-motion",
                        "lucide-react",
                        "class-variance-authority",
                        "clsx",
                        "tailwind-merge"
                    ],
                    "gsap-vendor": ["gsap"],
                    "firebase-vendor": ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
                    "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
                }
            }
        }
    }
})
