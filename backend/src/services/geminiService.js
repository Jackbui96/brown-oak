import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

import { SYSTEM_PROMPT } from "./systemPrompt.js";
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_KEY;

const generateGeminiReply = async (userMessage) => {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${SYSTEM_PROMPT}\n\nUser question: ${userMessage}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            }
        );

        return response.data.candidates[0]?.content?.parts[0]?.text;
    } catch (error) {
        throw new Error("Chat failed: " + (error.response?.data?.error?.message || error.message));
    }
}

export {
    generateGeminiReply,
}
