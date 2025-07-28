import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.2,
  }
});

export async function processContentWithGemini(content: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Analyze the following content and provide a concise summary, identify the category (e.g., Development, Work, Design), and suggest 3-5 relevant tags. Content: "${content}"` }] }],
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing content with Gemini:", error);
    return "Error analyzing content.";
  }
}