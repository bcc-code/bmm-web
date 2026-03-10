import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: "unit",
					include: ["test/unit/*.{test,spec}.ts"],
					environment: "node",
				},
			},
			{
				test: {
					name: "e2e",
					include: ["test/e2e/*.{test,spec}.ts"],
					environment: "node",
				},
			},
			await defineVitestProject({
				test: {
					name: "nuxt",
					include: ["test/nuxt/*.{test,spec}.ts"],
					environment: "nuxt",
				},
			}),
		],
	},
	plugins: [tailwindcss()],
});
