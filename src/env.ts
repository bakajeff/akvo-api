import { z } from "zod";

import { config } from "dotenv";

config();

export const envSchema = z.object({
	JWT_SECRET_KEY: z.string(),
	DATABASE_URL: z.string().url(),
	API_BASE_URL: z.string().url(),
	AUTH_REDIRECT_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
