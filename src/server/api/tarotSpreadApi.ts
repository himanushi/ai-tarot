import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { tarotDrawHistory, tarotSpreads } from "~/db/schema";
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
      .from(tarotDrawHistory)
      .where(
        and(
          eq(tarotDrawHistory.userId, me.id),
          eq(tarotDrawHistory.id, questionId),
        ),
      )
      .limit(1)
      .get();

    if (!question) {
      return c.json({ error: "question not found" }, 404);
    }

    const spreads = await db.select().from(tarotSpreads);

    const systemPrompt = `あなたはタロット占い師です。
以下のスプレッドを考慮して、最も適切なスプレッドを1つ選び、spread_idを返してください:
${spreads.map((s) => `${s.id}: ${s.name} - ${s.description}`).join("\n")}
レスポンスは以下の形式で返してください:
{
  "recommendedSpreadId": <spread_id>
}`;

    // const response = await completions<{
    //   recommendedSpreadId: number;
    // }>({
    //   systemPrompt,
    //   prompt: `質問: ${question.question}`,
    //   model: "gpt-4o",
    //   apiKey: c.env.OPENAI_API_KEY,
    //   responseFormat: {
    //     type: "json_schema",
    //     json_schema: {
    //       name: "recommendSpread",
    //       description:
    //         "Returns the most suitable tarot spread for the question",
    //       schema: {
    //         type: "object",
    //         properties: {
    //           recommendedSpreadId: { type: "integer" },
    //         },
    //         required: ["recommendedSpreadId"],
    //         additionalProperties: false,
    //       },
    //       strict: true,
    //     },
    //   },
    // });
    const response = { recommendedSpreadId: 1 };

    if (!response.recommendedSpreadId) {
      return c.json({ error: "Recommended spread not found" }, 404);
    }

    return c.json({ data: response });
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
