
import { GoogleGenAI, Type } from "@google/genai";
import { type SlipData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume the key is always present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const extractInfoFromSlip = async (base64Image: string): Promise<SlipData | null> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                parts: [
                    { 
                        text: "You are an expert OCR system for Thai bank transfer slips. Analyze the provided image. Extract the following information precisely: 1. The total transfer amount. 2. The date of the transfer. Format the date as 'YYYY-MM-DD'. Respond ONLY with a JSON object. If any piece of information cannot be determined, its value should be null." 
                    },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    amount: {
                        type: Type.NUMBER,
                        description: 'The transfer amount as a number, without commas.'
                    },
                    date: {
                        type: Type.STRING,
                        description: "The transfer date in YYYY-MM-DD format."
                    }
                },
                required: ["amount", "date"],
            }
        }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Validate the parsed object has the expected shape
    if (parsedJson && typeof parsedJson.amount === 'number' && typeof parsedJson.date === 'string') {
        return parsedJson as SlipData;
    }

    return { amount: parsedJson.amount || null, date: parsedJson.date || null };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Propagate the error to be handled by the caller
    throw new Error("Failed to process slip with Gemini API.");
  }
};
