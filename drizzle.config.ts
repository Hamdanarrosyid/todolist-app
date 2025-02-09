import { config } from "dotenv";
config();

const drizzleConfig = {
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  };

export default drizzleConfig;
