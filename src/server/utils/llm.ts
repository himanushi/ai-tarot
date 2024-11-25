import OpenAI from "openai";
import type {
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from "openai/resources/index.mjs";

export const completions = async <T extends {}>({
  systemPrompt,
  prompt,
  model = "gpt-4o",
  apiKey,
  responseFormat,
}: {
  systemPrompt: string;
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
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: responseFormat,
    });

    const content = response.choices[0].message.content;

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
