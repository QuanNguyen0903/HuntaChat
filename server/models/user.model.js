import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    bio: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },

}, { timestamps: true })   // ✅ yaha change kiya

// // password hash karne ke liye pre-hook
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next()
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

// // password compare karne ka method
// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)
// }

// // Access token generate
// userSchema.methods.generateAccessToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//             bio: this.bio,
//             email: this.email,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }

// // Refresh token generate
// userSchema.methods.generateRefreshToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

export const User = mongoose.model("User", userSchema)
