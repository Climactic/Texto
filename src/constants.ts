import path from "node:path";
import { z } from "zod";
import {
  DEFAULT_PORT,
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_DURATION,
} from "./defaults";

const rawEnv = {
  PORT: process.env.PORT ?? DEFAULT_PORT,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ?? DEFAULT_RATE_LIMIT_MAX,
  RATE_LIMIT_DURATION:
    process.env.RATE_LIMIT_DURATION ?? DEFAULT_RATE_LIMIT_DURATION,
};

const envSchema = z.object({
  PORT: z.number().or(z.string()).transform(Number),
  RATE_LIMIT_MAX: z.number().or(z.string()).transform(Number),
  RATE_LIMIT_DURATION: z.number().or(z.string()).transform(Number),
});

const env = envSchema.parse(rawEnv);

export const PORT = env.PORT;
export const RATE_LIMIT_MAX = env.RATE_LIMIT_MAX;
export const RATE_LIMIT_DURATION = env.RATE_LIMIT_DURATION;

export const MDX_DIR = path.join(process.cwd(), "content");
