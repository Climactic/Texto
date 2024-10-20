import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { logger } from "@tqman/nice-logger";
import compress from "elysia-compress";

import { cloudflareGenerator } from "./utils";
import { PORT, RATE_LIMIT_MAX, RATE_LIMIT_DURATION } from "./constants";
import controller from "./controller";

const app = new Elysia();

// Ratelimit
app.use(
  rateLimit({
    max: RATE_LIMIT_MAX,
    duration: RATE_LIMIT_DURATION,
    generator: cloudflareGenerator,
  })
);

// Logger
app.use(
  logger({
    mode: "combined",
  })
);

// Compression
app.use(compress());

// Routes Controller
app.use(controller);

// Start Server
app.listen(PORT);
console.log(`Server is running on http://localhost:${PORT}`);
