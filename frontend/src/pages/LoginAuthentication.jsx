import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import app from "../config/firebaseConfig";

const PhoneLogin = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth(app);

    // Initialize reCAPTCHA
    const setUpRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        console.log("reCAPTCHA solved");
                    },
                }
            );
        }
    };

    // Send OTP
    const handleSendOtp = () => {
        setUpRecaptcha();
        const phoneNumber = `+${phone}`;
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setIsOtpSent(true);
                console.log("OTP sent");
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };

    // Verify OTP
    const handleVerifyOtp = () => {
        const confirmationResult = window.confirmationResult;

        confirmationResult
            .confirm(otp)
            .then((result) => {
                console.log("User signed in successfully:", result.user);
                setIsLoggedIn(true);
                alert("Login successful!");
            })
            .catch((error) => {
                console.error("Error verifying OTP:", error);
            });
    };

    // Handle re-login (sign out and send OTP again)
    const handleReLogin = () => {
        signOut(auth).then(() => {
            setIsLoggedIn(false);
            setIsOtpSent(false);
            setPhone("");
            setOtp("");
            alert("You have been signed out. Please log in again.");
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    };

    return (
        <div>
            <h1>{isLoggedIn ? "Welcome Back" : "Phone Login"}</h1>
            {!isLoggedIn ? (
                <>
                    {!isOtpSent ? (
                        <div>
                            <input
                                type="tel"
                                placeholder="Enter phone number with country code"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <button onClick={handleSendOtp}>Send OTP</button>
                            <div id="recaptcha-container"></div>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button onClick={handleVerifyOtp}>Verify OTP</button>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <button onClick={handleReLogin}>Re-login</button>
                </div>
            )}
        </div>
    );
};

export default PhoneLogin;
