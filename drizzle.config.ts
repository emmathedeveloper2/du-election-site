import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as process from "node:process";

const url = process.env.DATABASE_URL!

export default defineConfig({
    out: './drizzle',
    schema: './app/database/schemas/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url,
    },
});
