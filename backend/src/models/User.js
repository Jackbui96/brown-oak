import mongoose from 'mongoose';
import { getConnection } from "../databases/index.js";

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    registered: { type: Date, default: Date.now },
    lastLoggedIn: {type: Date, default: Date.now },
})

let User = null;

const getUserModel = () => {
    if (!User) {
        const connection = getConnection("brownOak");
        User = connection.model("User", userSchema);
    }
    return User;
}

export default getUserModel;
