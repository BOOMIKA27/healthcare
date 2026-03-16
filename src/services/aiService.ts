import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DiagnosisResult {
  analysis: string;
  triageLevel: "emergency" | "urgent" | "routine";
  recommendations: string[];
  translatedSummary: string;
}

export async function getAIDiagnosis(
  symptoms: string,
  vitals: any,
  language: string,
  imageData?: string
): Promise<DiagnosisResult> {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `You are an expert medical diagnostic assistant for rural healthcare. 
            Analyze the following symptoms and vitals. 
            Symptoms: ${symptoms}
            Vitals: ${JSON.stringify(vitals)}
            
            Provide:
            1. A detailed analysis in English.
            2. A triage level: 'emergency' (life-threatening), 'urgent' (needs doctor soon), or 'routine'.
            3. A list of 3-5 clear recommendations.
            4. A summary translated into the patient's language: ${language}.
            
            Return the result in JSON format.`
          },
          ...(imageData ? [{ inlineData: { data: imageData.split(',')[1], mimeType: "image/jpeg" } }] : [])
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          triageLevel: { type: Type.STRING, enum: ["emergency", "urgent", "routine"] },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          translatedSummary: { type: Type.STRING }
        },
        required: ["analysis", "triageLevel", "recommendations", "translatedSummary"]
      }
    }
  });

  const response = await model;
  return JSON.parse(response.text);
}
