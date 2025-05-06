import { loadConfigFromSSM } from "../services/configService.js";

const getFrontendConfig = async (req, res) => {
    const project = req.params.project;

    try {
        const fullConfig = await loadConfigFromSSM(project, ["keys/firebase"]);
        const frontendConfig = {
            apiKey: fullConfig.FIREBASE_API,
            appId: fullConfig.FIREBASE_APP_ID,
            authDomain: fullConfig.FIREBASE_AUTH_DOMAIN,
            projectId: fullConfig.FIREBASE_PROJECT_ID,
        }

        res.status(200).json(frontendConfig);
    } catch (err) {
        console.error(`[Config] Error loading config for ${{project}}`, err);
        res.status(500).json({ error: "Failed to load config" });
    }
}

export {
    getFrontendConfig,
}
