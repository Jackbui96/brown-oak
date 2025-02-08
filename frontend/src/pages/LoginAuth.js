// import express = require("express");
// import jwt= require("jsonwebtoken");
import PhoneInput from "react-phone-input-2";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import apaniClient from "../api-clients/apaniClient";

const LoginAuth = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const requestOtp = async() => {
        if (User.findOne())
        try {
            await apaniClient.post("otps/send-otp", {
                phoneNumber: "+" + phoneNumber
            })
        } catch (err) {
            console.log(err)
        }
    }

    const validate = async() => {
        try {
            await apaniClient.post("otps/verify-otp", {
                phoneNumber: "+" + phoneNumber,
                otp: otp
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <h2>Request OTP</h2>
            <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={setPhoneNumber}
            />
            <button type="submit" style={{marginTop: '10px'}} onClick={requestOtp}>
                Request OTP
            </button>
            <p>OTP Code</p>
            <TextField
                label="OTP"
                onChange={(event) => {
                    setOtp(event.target.value)
                }}
            />
            <button type="submit" style={{marginTop: '10px'}} onClick={validate}>
                Validate
            </button>
        </div>
    );
};

export default LoginAuth;
