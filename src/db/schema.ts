import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Orientation Enum
export enum Orientation {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

// users テーブル
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  googleUserId: text("googleUserId").unique().notNull(),
  point: integer("point").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotSpreads テーブル
export const tarotSpreads = sqliteTable("tarot_spreads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotSpreadPositions テーブル
export const tarotSpreadPositions = sqliteTable("tarot_spread_positions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  spreadId: integer("spread_id")
    .references(() => tarotSpreads.id)
    .notNull(),
  drawOrder: integer("draw_order").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  orientation: text("orientation")
    .$type<Orientation>()
    .default(Orientation.Vertical)
    .notNull(),
  description: text("description").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export enum TarotCardCategory {
  MajorArcana = "major_arcana", // 大アルカナ
  Swords = "swords", // 剣
  Cups = "cups", // カップ
  Wands = "wands", // 杖
  Pentacles = "pentacles", // コイン
}

// tarotCards テーブル
export const tarotCards = sqliteTable("tarot_cards", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").$type<TarotCardCategory>().notNull(),
  cardNumber: integer("card_number", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  uprightMeaning: text("upright_meaning").notNull(),
  reversedMeaning: text("reversed_meaning").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotDrawHistory テーブル
export const tarotDrawHistories = sqliteTable("tarot_draw_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  spreadId: integer("spread_id").references(() => tarotSpreads.id),
  modelName: text("model_name").notNull(), // 使用したモデル名
  question: text("question").notNull(), // 質問内容
  deck: text("deck", { mode: "json" })
    .$type<[number, number][]>()
    .notNull()
    .default([]),
  dealDeck: text("deal_deck", { mode: "json" })
    .$type<[number, number][]>()
    .notNull()
    .default([]),
  readingResult: text("reading_result"), // 占い結果
  errorMessage: text("error_message"), // エラーメッセージ
  isArchived: integer("is_archived", { mode: "boolean" }) // アーカイブフラグ
    .default(false)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});
