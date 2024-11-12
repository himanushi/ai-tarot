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
  name: text("name").notNull(), // スプレッドの名前
  description: text("description").notNull(), // スプレッドの説明
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
  drawOrder: integer("draw_order").notNull(), // 描画順序
  x: real("x").notNull(), // X座標
  y: real("y").notNull(), // Y座標
  orientation: text("orientation")
    .$type<Orientation>()
    .default(Orientation.Vertical)
    .notNull(), // 方向（縦・横）
  description: text("description").notNull(), // 配置の説明
  displayName: text("display_name").notNull(), // 表示名
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotCards テーブル
export const tarotCards = sqliteTable("tarot_cards", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // カードの名前
  description: text("description").notNull(), // カードの説明
  uprightMeaning: text("upright_meaning").notNull(), // 正位置の意味
  reversedMeaning: text("reversed_meaning").notNull(), // 逆位置の意味
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotDrawHistory テーブル
export const tarotDrawHistory = sqliteTable("tarot_draw_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  spreadId: integer("spread_id")
    .references(() => tarotSpreads.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotDrawCards テーブル
export const tarotDrawCards = sqliteTable("tarot_draw_cards", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  drawHistoryId: integer("draw_history_id")
    .references(() => tarotDrawHistory.id)
    .notNull(),
  cardId: integer("card_id")
    .references(() => tarotCards.id)
    .notNull(),
  drawOrder: integer("draw_order").notNull(), // 描画順序
  orientation: text("orientation")
    .$type<Orientation>()
    .default(Orientation.Vertical)
    .notNull(), // 方向（縦・横）
  isReversed: integer("is_reversed", { mode: "boolean" })
    .default(false)
    .notNull(), // 正位置か逆位置か
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// tarotReadingResults テーブル
export const tarotReadingResults = sqliteTable("tarot_reading_results", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  drawHistoryId: integer("draw_history_id")
    .references(() => tarotDrawHistory.id)
    .notNull(),
  modelName: text("model_name").notNull(), // 使用したモデル名
  question: text("question").notNull(), // 質問
  readingResult: text("reading_result"), // 占い結果
  errorMessage: text("error_message"), // エラーメッセージ
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});
