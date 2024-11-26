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

const shuffleDeck = (): [number, number][] => {
  const totalCards = 78;
  const deck: [number, number][] = [];

  for (let i = 1; i <= totalCards; i++) {
    const orientation = Math.random() < 0.5 ? 0 : 1;
    deck.push([i, orientation]);
  }

  // Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

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
          deck: shuffleDeck(),
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
