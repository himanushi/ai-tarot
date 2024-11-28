import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { tarotCards, tarotSpreads } from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const getTarotCardsApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  zValidator(
    "query",
    z.object({
      ids: z
        .string()
        .transform((v) => v.split(",").map((n) => Number.parseInt(n, 10))),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);
    const spreads = await db
      .select()
      .from(tarotCards)
      .where(inArray(tarotCards.id, c.req.valid("query").ids));

    return c.json({ data: spreads });
  },
);
