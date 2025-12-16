import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIProductData {
  name: string;
  category: 'Bags' | 'Sweaters' | 'Baby' | 'Accessories' | 'Home';
  price: number;
  description: string;
  materials: string;
  care: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const generateProductDetailsFromImage = async (file: File): Promise<AIProductData> => {
  try {
    const base64Data = await fileToBase64(file);

    const prompt = `
      You are a helpful assistant for "Fatma's Crochet Corner", a handmade e-commerce store.
      Analyze this image of a crochet product and generate product details in JSON format.
      
      The category must be exactly one of: 'Bags', 'Sweaters', 'Baby', 'Accessories', 'Home'.
      
      Return a JSON object with the following fields:
      - name: A creative, warm, and cozy name for the product.
      - category: The best fitting category from the list above.
      - price: An estimated price number in USD (just the number, e.g. 45).
      - description: A warm, inviting description (2-3 sentences) suitable for a handmade shop.
      - materials: An educated guess on the yarn materials (e.g., "100% Cotton", "Merino Wool blend").
      - care: Brief care instructions based on the likely material.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return data as AIProductData;

  } catch (error) {
    console.error("Error generating product details:", error);
    throw error;
  }
};
