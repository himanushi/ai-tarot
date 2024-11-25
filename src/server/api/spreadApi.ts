import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { tarotDrawHistory } from "~/db/schema";
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

    const response = await completions({
      prompt: "おはようございます！今日の運勢は？",
      model: "gpt-4o",
      apiKey: c.env.OPENAI_API_KEY,
      responseFormat: {
        // ここを追記して。
      },
    });

    return c.json({ data: response });
  },
);
