import { config } from "dotenv";
// Load .env.local in development; on Vercel env vars come from process.env directly
config({ path: ".env.local", override: false });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
