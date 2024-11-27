import { zValidator } from "@hono/zod-validator";
import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import {
  TarotCardCategory,
  tarotCards,
  tarotDrawHistories,
  tarotSpreadPositions,
  tarotSpreads,
} from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";
import { completions } from "../utils/llm";

export const getTarotDrawHistoryApi =
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
      const history = await db
        .select()
        .from(tarotDrawHistories)
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        )
        .get();

      return c.json({ data: history });
    },
  );

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

export const dealCardsTarotDrawHistoryApi =
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
      const history = await db
        .select()
        .from(tarotDrawHistories)
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        )
        .get();

      if (!history?.spreadId) {
        return c.json({ error: "Not found: spreadId" }, 404);
      }

      const spread = await db
        .select()
        .from(tarotSpreads)
        .where(and(eq(tarotSpreads.id, history.spreadId)))
        .get();

      if (!spread) {
        return c.json({ error: "Not found: spread" }, 404);
      }

      const positions = await db
        .select()
        .from(tarotSpreadPositions)
        .where(eq(tarotSpreadPositions.spreadId, history.spreadId))
        .orderBy(asc(tarotSpreadPositions.drawOrder));

      const deck = history.deck;
      const dealDeck: [number, number][] = positions.map((_, index) => [
        deck[index + 6][0],
        deck[index + 6][1],
      ]);

      await db
        .update(tarotDrawHistories)
        .set({
          dealDeck,
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

const categoryNames = {
  [TarotCardCategory.MajorArcana]: "大アルカナ",
  [TarotCardCategory.Swords]: "剣",
  [TarotCardCategory.Cups]: "カップ",
  [TarotCardCategory.Wands]: "杖",
  [TarotCardCategory.Pentacles]: "コイン",
};

export const fortuneTellingTarotDrawHistoryApi =
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
      const history = await db
        .select()
        .from(tarotDrawHistories)
        .where(
          and(
            eq(tarotDrawHistories.id, id),
            eq(tarotDrawHistories.userId, me.id),
          ),
        )
        .get();

      if (!history?.spreadId) {
        return c.json({ error: "Not found: spreadId" }, 404);
      }

      const cards = await db.select().from(tarotCards);

      const spread = await db
        .select()
        .from(tarotSpreads)
        .where(and(eq(tarotSpreads.id, history.spreadId)))
        .get();

      if (!spread) {
        return c.json({ error: "Not found: spread" }, 404);
      }

      const positions = await db
        .select()
        .from(tarotSpreadPositions)
        .where(eq(tarotSpreadPositions.spreadId, history.spreadId))
        .orderBy(asc(tarotSpreadPositions.drawOrder));

      const systemPrompt = `あなたはタロット占い師です。以下のスプレッドを考慮して質問に対する回答を200文字程度で返してください。スプレッド配置のx,yは左上が(0,0)です。
        スプレッド: ${spread.name}(${spread.description})
        カード配置: ${positions
          .map((p) => {
            const currentCard = cards.find(
              (c) => c.id === history.dealDeck[p.drawOrder][0],
            );
            const orientation = history.dealDeck[p.drawOrder][1];
            return `[スプレッド配置番号: ${p.drawOrder + 1}, 配置(x:${p.x}, y:${p.y}), 位置の意味: ${
              p.description
            }], [引いたカード: ${`${categoryNames[currentCard?.category as TarotCardCategory]}の${currentCard?.name}`}(${
              orientation ? "正位置" : "逆位置"
            }), カードの意味: ${orientation ? `正位置では、${currentCard?.uprightMeaning}` : `逆位置では、${currentCard?.reversedMeaning}`}]`;
          })
          .join("\n")}
        `;

      const response = await completions({
        systemPrompt,
        prompt: `質問: ${history.question}`,
        model: "gpt-4o-mini",
        apiKey: c.env.OPENAI_API_KEY,
        responseFormat: {
          type: "text",
        },
      });

      console.log("systemPrompt", systemPrompt);
      console.log("response", response);

      await db
        .update(tarotDrawHistories)
        .set({
          readingResult: response,
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
