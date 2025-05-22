
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCptu1vE3_BYvZ0t9MFaMxSJs52KkWGEg0";
const generativeAI = new GoogleGenerativeAI(API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface EnhanceResumeProps {
  resumeText: string;
  jobRole: string;
}

export async function enhanceResume({ resumeText, jobRole }: EnhanceResumeProps): Promise<string> {
  try {
    const prompt = `
      You are an expert resume writer and career coach. 
      Your task is to enhance and optimize the following resume for the role of "${jobRole}".
      
      Please:
      1. Rewrite the content with strong action verbs
      2. Quantify achievements where possible
      3. Use ATS-friendly formatting and keywords relevant to the ${jobRole} position
      4. Organize information clearly with bullet points where appropriate
      5. Focus on accomplishments rather than just responsibilities
      
      Here is the resume to enhance:
      ${resumeText}
      
      Respond ONLY with the optimized resume text. Do not include any explanations, introductions, or comments.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error enhancing resume:", error);
    throw new Error("Failed to enhance resume. Please try again later.");
  }
}
