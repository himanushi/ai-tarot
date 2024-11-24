import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { tarotCards } from "~/db/schema";
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

    // await db.insert(tarotCards).values([
    //   { name: "The Fool", number: 0 },
    //   { name: "The Magician", number: 1 },
    //   { name: "The High Priestess", number: 2 },
    //   { name: "The Empress", number: 3 },
    //   { name: "The Emperor", number: 4 },
    //   { name: "The Hierophant", number: 5 },
    //   { name: "The Lovers", number: 6 },
    //   { name: "The Chariot", number: 7 },
    //   { name: "Strength", number: 8 },
    //   { name: "The Hermit", number: 9 },
    //   { name: "Wheel of Fortune", number: 10 },
    //   { name: "Justice", number: 11 },
    // ]);

    return c.json({ data: "ok" });
  },
);
