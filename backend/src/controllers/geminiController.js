const { generateGeminiReply } = require("../services/geminiService");

const handleChatRequest = async (req, res) => {
    const { message } = req.body;

    try {
        const reply = await generateGeminiReply(message);
        res.status(200).json({ reply });
    } catch (err) {
        console.error("Error in controller:", err.message, err.stack);
        res.status(500).json({ error: "Chat failed", details: err.message });
    }
};

module.exports = {
    handleChatRequest
}
