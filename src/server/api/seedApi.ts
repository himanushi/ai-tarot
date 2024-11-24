import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { TarotCardCategory, tarotCards } from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const insertSeedApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);

    const card = await db.select().from(tarotCards).limit(1).get();
    if (card) {
      return c.json({ error: "Already seeded" }, 400);
    }

    await db.insert(tarotCards).values([
      {
        name: "愚者",
        description: "新しい旅立ち、自由、無限の可能性を象徴するカード",
        uprightMeaning: "冒険心、自由、純粋さ、信念",
        reversedMeaning: "不注意、愚かさ、無計画、リスクを取ることの恐れ",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 0,
      },
    ]);

    return c.json({ data: "ok" });
  },
);
