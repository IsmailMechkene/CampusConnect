import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schemas: ["./prisma/schema.prisma"],
  database: {
    provider: "postgresql",
    connectionString: process.env.DATABASE_URL!, // l'URL Neon
  },
});
