import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.2,
  }
});

export interface GeminiAnalysis {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  category: string;
  visualization: {
    shouldVisualize: boolean;
    chartType: 'bar' | 'line' | 'pie' | 'none';
    data: { label: string; value: number }[];
  };
  error?: string;
}

export async function processContentWithGemini(content: string, images: {mimeType: string, data: string}[] = []): Promise<GeminiAnalysis> {
  const prompt = `
    Analyze the following content (which may include text and images) and return a structured JSON object.
    First, check if the content contains sensitive information such as passwords, credit card numbers, or personal identification numbers. If it does, return a JSON object with an "error" field set to "sensitive".
    Otherwise, the JSON object should have the following schema:
    {
      "title": "A concise, descriptive title for the content.",
      "summary": "A detailed summary of the content, consisting of at least two to three paragraphs.",
      "keyPoints": ["An array of key takeaways or bullet points."],
      "tags": ["An array of 3-5 relevant tags."],
      "category": "A single category like 'Development', 'Work', 'Design', 'Research', 'Personal', etc.",
      "visualization": {
        "shouldVisualize": "A boolean indicating if the content contains data that can be visualized.",
        "chartType": "If shouldVisualize is true, suggest a chart type: 'bar', 'line', 'pie', or 'none'.",
        "data": "If shouldVisualize is true, provide the data in a format suitable for the chart type (e.g., an array of objects with labels and values)."
      }
    }

    Content to analyze: "${content}"
  `;

  const imageParts = images.map(image => ({
    inlineData: {
      mimeType: image.mimeType,
      data: image.data,
    },
  }));

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
    });

    const response = result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error processing content with Gemini:", error);
    return {
      title: "Error",
      summary: "Could not analyze content.",
      keyPoints: [],
      tags: [],
      category: "Error",
      visualization: {
        shouldVisualize: false,
        chartType: "none",
        data: [],
      },
      error: "Error analyzing content.",
    };
  }
}