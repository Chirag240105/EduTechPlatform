import OpenAI from 'openai';

let client;

const getClient = async () => {
  if (client) return client;

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured in environment variables");
  }

  client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  return client;
};

export const generateWithAI = async (prompt, options = {}) => {
  const ai = await getClient();

  try {
    const response = await ai.chat.completions.create({
      model: "openrouter/free",           // ← smart router to free models (recommended)
      // Alternative good free models:
      // model: "stepfun/step-3.5-flash:free",
      // model: "arcee-ai/trinity-large-preview:free",
      // model: "z-ai/glm-4.5-air:free",

      messages: [{
        role: "user",
        content: prompt,
      }],
      temperature: 0.7,
      max_tokens: 2048,
      ...options,                       // allow overrides if needed
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from OpenRouter");
    }

    return content.trim();

  } catch (error) {
    console.error("OpenRouter Error:", {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};