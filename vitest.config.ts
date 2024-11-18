import path from "node:path";
import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersConfig(async () => {
  const migrationsPath = path.join(__dirname, "src", "db", "migrations");
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      setupFiles: ["./test/applyMigrations.ts"],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: "./wrangler.toml",
          },
          miniflare: {
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
    plugins: [
      pages(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
      tsconfigPaths(),
    ],
    poolOptions: {
      workers: {
        miniflare: {},
        wrangler: { configPath: "./wrangler.toml" },
      },
    },
  };
});
