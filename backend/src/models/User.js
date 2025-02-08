const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    registered: { type: Date, default: Date.now },
    lastLoggedIn: {type: Date, default: Date.now },
})
//
// userSchema.static.getOneUser = async(phoneNumber) => {
//     if (!phoneNumber || typeof phoneNumber !== "string") {
//         throw new Error("Invalid phoneNumber input")
//     }
//
//     try {
//         return await this.findOne({phoneNumber})
//     } catch (err) {
//         console.error(`[getOneUser] Error fetching user by phoneNumber: ${phoneNumber}`, err);
//         throw new Error("Database query failed");
//     }
// }

module.exports = mongoose.model("User", userSchema, "users");
