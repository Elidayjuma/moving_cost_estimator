"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

interface CostEstimate {
  cost: number;
  breakdown: string;
}

export async function estimateCostFromPrompt(prompt: string): Promise<CostEstimate | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message?.content;
    console.log(content)
    if (!content) throw new Error("No response from model");

    // Extract and parse the JSON from the response
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }

    throw new Error("Invalid JSON in response");
  } catch (error) {
    console.error("Error estimating cost:", error);
    return null;
  }
}


export async function generateNames(keyword: string): Promise<string[]> {
    if (!keyword.trim()) return []; // Ensure it always returns an array

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 20 creative startup name ideas based on the keyword: "${keyword}". Return only the names as a numbered list. No extra text`,
        },
      ],
      max_tokens: 500,            
        });

        const namesArray = response.choices[0].message?.content
            ?.split("\n")
            .filter((name) => name.trim() !== "")
            .map((name) => name.replace(/^\d+\.\s*/, "").trim()) || []; // Fallback to empty array

        return namesArray;
    } catch (error) {
        console.error("Error generating names:", error);
        return []; // Always return an array
    }
}

