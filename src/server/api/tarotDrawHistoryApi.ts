import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { tarotDrawHistories } from "~/db/schema";
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
        .insert(tarotDrawHistories)
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
      "param",
      z.object({
        id: z.string().transform((v) => Number.parseInt(v, 10)),
      }),
    ),
    zValidator(
      "json",
      z.object({
        spreadId: z.number(),
      }),
    ),
    async (c) => {
      const me = c.get("me");
      if (!me) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      const { spreadId } = c.req.valid("json");

      const db = drizzle(c.env.DB);
      await db
        .update(tarotDrawHistories)
        .set({
          spreadId: spreadId,
        })
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        );

      return c.json({ data: "ok" });
    },
  );

export const shuffleDeckTarotDrawHistoryApi =
  createFactory<HonoPropsType>().createHandlers(
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().transform((v) => Number.parseInt(v, 10)),
      }),
    ),
    async (c) => {
      const me = c.get("me");
      if (!me) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      const db = drizzle(c.env.DB);

      await db
        .update(tarotDrawHistories)
        .set({
          deck: [],
        })
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        );

      return c.json({ data: "ok" });
    },
  );

export const fortuneTellingTarotDrawHistoryApi =
  createFactory<HonoPropsType>().createHandlers(
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().transform((v) => Number.parseInt(v, 10)),
      }),
    ),
    zValidator(
      "json",
      z.object({
        spreadId: z.number(),
      }),
    ),
    async (c) => {
      const me = c.get("me");
      if (!me) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      const { spreadId } = c.req.valid("json");

      const db = drizzle(c.env.DB);
      await db
        .update(tarotDrawHistories)
        .set({
          spreadId: spreadId,
        })
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        );

      return c.json({ data: "ok" });
    },
  );
