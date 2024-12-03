import { getTableColumns, sql } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { tarotCards, tarotSpreadPositions, tarotSpreads } from "~/db/schema";
import {
  seedTarotCards,
  seedTarotSpreadPositions,
  seedTarotSpreads,
} from "~/db/seed";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

const insertOrUpdateBatch = async (
  db: DrizzleD1Database<Record<string, never>>,
  table: any,
  data: any[],
) => {
  const columns = Object.keys(getTableColumns(table));
  const queries = data.map((record) => {
    const setValues = columns.reduce(
      (acc, column) => {
        if (column !== "id") {
          acc[column] = record[column];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return db
      .insert(table)
      .values(record)
      .onConflictDoUpdate({
        target: [table.id],
        set: setValues,
      });
  });

  await db.batch(queries as any);
};

export const insertSeedApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);
    await insertOrUpdateBatch(db, tarotCards, seedTarotCards);
    await insertOrUpdateBatch(db, tarotSpreads, seedTarotSpreads);
    await insertOrUpdateBatch(
      db,
      tarotSpreadPositions,
      seedTarotSpreadPositions,
    );

    return c.json({ data: "ok" });
  },
);
