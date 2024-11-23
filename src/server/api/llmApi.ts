import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { streamSSE } from "hono/streaming";
import OpenAI from "openai";
import { z } from "zod";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const postCompletionApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  zValidator(
    "query",
    z.object({
      text: z.string(),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userInput = c.req.query("text");
    if (!userInput) {
      return c.json({ error: "text is required" }, 400);
    }

    const client = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    return streamSSE(c, async (stream) => {
      const completionStream = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: userInput }],
        stream: true,
      });

      for await (const chunk of completionStream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          await stream.writeSSE({ data: content });
        }
      }
    });
  },
);
