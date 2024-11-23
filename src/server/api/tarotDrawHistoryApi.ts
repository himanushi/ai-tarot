import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { tarotDrawHistory } from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const createTarotDrawHistoryApi =
  createFactory<HonoPropsType>().createHandlers(
    authMiddleware,
    zValidator(
      "json",
      z.object({
        question: z.string(),
      }),
    ),
    async (c) => {
      const me = c.get("me");
      if (!me) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { question } = c.req.valid("json");
      if (!question) {
        return c.json({ error: "text is required" }, 400);
      }

      const db = drizzle(c.env.DB);
      await db.insert(tarotDrawHistory).values({
        userId: me.id,
        question,
        modelName: "gpt-4o",
      });

      return c.json({ data: "ok" });
    },
  );
