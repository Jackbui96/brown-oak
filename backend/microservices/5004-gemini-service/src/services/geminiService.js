import axios from "axios";
import { SYSTEM_PROMPT } from "./systemPrompt.js";

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const generateGeminiReply = async (userMessage) => {
    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }

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

        return response.data.candidates[0]?.content?.parts[0]?.text || null;
    } catch (error) {
        throw new Error("Chat failed: " + (error.response?.data?.error?.message || error.message));
    }
}

export {
    generateGeminiReply,
}
