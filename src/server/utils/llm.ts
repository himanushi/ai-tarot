import OpenAI from "openai";
import type {
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from "openai/resources/index.mjs";

export const completions = async <T extends {}>({
  prompt,
  model = "gpt-4o",
  apiKey,
  responseFormat,
}: {
  prompt: string;
  model: string;
  apiKey: string;
  responseFormat?:
    | ResponseFormatText
    | ResponseFormatJSONObject
    | ResponseFormatJSONSchema;
}): Promise<T> => {
  const client = new OpenAI({
    apiKey,
  });

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a tarot reading assistant. Always respond in JSON format.",
        },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "tarot_spread_recommendations",
          description:
            "A list of recommended tarot spreads based on the user's query.",
          schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    spread_name: { type: "string" },
                    description: { type: "string" },
                    card_count: { type: "integer", minimum: 1 },
                    difficulty: {
                      type: "string",
                      enum: ["easy", "moderate", "advanced"],
                    },
                  },
                  required: ["spread_name", "description"],
                },
              },
            },
            required: ["recommendations"],
          },
          strict: true,
        },
      },
    });

    // レスポンスデータを JSON 形式で返却
    const content = response.choices[0].message.content;
    console.log("Response content:", content);

    if (!content) {
      throw new Error("Response content is empty or undefined");
    }

    const jsonResponse = JSON.parse(content);
    return jsonResponse;
  } catch (error: any) {
    console.error("Error in OpenAI API call:", error.message || error);
    throw new Error(
      `Failed to retrieve JSON response: ${error.response?.data || error.message}`,
    );
  }
};
