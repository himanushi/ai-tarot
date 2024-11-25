import { getTableColumns, sql } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { tarotCards, tarotSpreads } from "~/db/schema";
import { seedTarotCards, seedTarotSpreads } from "~/db/seed";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

const insertOrUpdate = async (
  db: DrizzleD1Database<Record<string, never>>,
  table: any,
  data: any[],
) => {
  const columns = Object.keys(getTableColumns(table));

  for (const record of data) {
    const setValues = columns.reduce(
      (acc, column) => {
        if (column !== "id") {
          acc[column] = record[column];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    await db
      .insert(table)
      .values(record)
      .onConflictDoUpdate({
        target: [table.id],
        set: setValues,
      });
  }
};

export const insertSeedApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);
    await insertOrUpdate(db, tarotCards, seedTarotCards);
    await insertOrUpdate(db, tarotSpreads, seedTarotSpreads);

    return c.json({ data: "ok" });
  },
);
