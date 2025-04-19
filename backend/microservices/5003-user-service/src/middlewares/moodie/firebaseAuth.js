import admin from "firebase-admin";

// Flag to track if Firebase has been initialized
let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK with credentials loaded from environment
 */
export const setupFirebaseAuth = async () => {
    if (firebaseInitialized || admin.apps.length) {
        console.log("Firebase already initialized, skipping setup");
        return;
    }

    try {
        console.log("Setting up Firebase authentication...");
        const firebaseAdmin = JSON.parse(process.env.FIREBASE_ADMIN);

        admin.initializeApp({
            credential: admin.credential.cert(firebaseAdmin),
        });

        firebaseInitialized = true;
        console.log("✅ Firebase authentication initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize Firebase:", error);
        throw error; // Re-throw to halt server startup if Firebase init fails
    }
};

/**
 * Middleware to verify Firebase tokens in request headers
 */
export const verifyFirebaseToken = async (req, res, next) => {
    // Check if Firebase has been initialized
    if (!firebaseInitialized && !admin.apps.length) {
        console.error("❌ Firebase not initialized yet! Token verification will fail.");
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        req.user = null;
        return next(); // Allow unauthenticated access to public routes
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = {
            firebaseId: decoded.uid,
            email: decoded.email,
            name: decoded.name,
        };
    } catch (err) {
        console.warn("❌ Invalid Firebase token:", err.message);
        req.user = null;
    }

    return next();
};
