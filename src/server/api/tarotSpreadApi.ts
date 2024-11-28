import { zValidator } from "@hono/zod-validator";
import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import {
  tarotDrawHistories,
  tarotSpreadPositions,
  tarotSpreads,
} from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";
import { completions } from "../utils/llm";

export const choiceSpreadApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  zValidator(
    "query",
    z.object({
      questionId: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { questionId } = c.req.valid("query");
    if (!questionId) {
      return c.json({ error: "question is required" }, 400);
    }

    const db = drizzle(c.env.DB);
    const question = await db
      .select()
      .from(tarotDrawHistories)
      .where(
        and(
          eq(tarotDrawHistories.userId, me.id),
          eq(tarotDrawHistories.id, questionId),
        ),
      )
      .limit(1)
      .get();

    if (!question) {
      return c.json({ error: "question not found" }, 404);
    }

    if (question.spreadId) {
      return c.json({ data: { recommendedSpreadId: question.spreadId } });
    }

    const spreads = await db.select().from(tarotSpreads);

    const systemPrompt = `あなたはタロット占い師です。
以下のスプレッドを考慮して、最も適切なスプレッドを1つ選び、spread_idを返してください:
${spreads.map((s) => `${s.id}: ${s.name} - ${s.description}`).join("\n")}
レスポンスは以下の形式で返してください:
{
  "recommendedSpreadId": <spread_id>
}`;

    const response = await completions({
      systemPrompt,
      prompt: `質問: ${question.question}`,
      model: "gpt-4o",
      apiKey: c.env.OPENAI_API_KEY,
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "recommendSpread",
          description:
            "Returns the most suitable tarot spread for the question",
          schema: {
            type: "object",
            properties: {
              recommendedSpreadId: { type: "integer" },
            },
            required: ["recommendedSpreadId"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });
    const content = JSON.parse(response);

    if (!content.recommendedSpreadId) {
      return c.json({ error: "Recommended spread not found" }, 404);
    }

    return c.json({ data: content });
  },
);

export const getTarotSpreadsApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);
    const spreads = await db.select().from(tarotSpreads);

    return c.json({ data: spreads });
  },
);

export const getTarotSpreadApi = createFactory<HonoPropsType>().createHandlers(
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
    const spread = await db
      .select()
      .from(tarotSpreads)
      .where(eq(tarotSpreads.id, id))
      .get();

    if (!spread) {
      return c.json({ error: "Not found" }, 404);
    }

    const positions = await db
      .select()
      .from(tarotSpreadPositions)
      .where(eq(tarotSpreadPositions.spreadId, spread.id))
      .orderBy(asc(tarotSpreadPositions.drawOrder));

    return c.json({ data: { spread, positions } });
  },
);
