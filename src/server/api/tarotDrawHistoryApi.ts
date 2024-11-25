import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
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

      const db = drizzle(c.env.DB);
      const results = await db
        .insert(tarotDrawHistory)
        .values({
          userId: me.id,
          question,
          modelName: "gpt-4o",
        })
        .returning();

      return c.json({ data: results[0] });
    },
  );

export const patchSpreadIdTarotDrawHistoryApi =
  createFactory<HonoPropsType>().createHandlers(
    authMiddleware,
    zValidator(
      "json",
      z.object({
        questionId: z.number(),
        spreadId: z.number(),
      }),
    ),
    async (c) => {
      const me = c.get("me");
      if (!me) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { questionId, spreadId } = c.req.valid("json");

      const db = drizzle(c.env.DB);
      await db
        .update(tarotDrawHistory)
        .set({
          spreadId: spreadId,
        })
        .where(
          and(
            eq(tarotDrawHistory.id, questionId),
            eq(tarotDrawHistory.userId, me.id),
          ),
        );

      return c.json({ data: "ok" });
    },
  );
