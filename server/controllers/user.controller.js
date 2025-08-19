import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cloudinary from "../utils/Cloudinary.js"
import { generateToken } from "../lib/token.js"
import { Message } from "../models/message.model.js"


const signUpUser = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.json({ success: false, Message: "Missinng Details" })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, Message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({ fullName, email, password: hashedPassword, bio });

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, Message: "Account created successfully" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("📩 Login API Hit:", { email, password });

        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        console.log("🔑 Password Match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }


        const token = generateToken(userData._id)

        res.json({ success: true, userData, token, message: "Login successfully" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }


}


const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}

const updateProfile = async (req, res) => {

    try {
        const { profilePic, fullName, bio } = req.body
        const userId = req.user._id
        console.log(req.user);
        
        let updatedUser

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true })
        } else {
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                bio,
                fullName
            }, { new: true })
        }
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }


}

export {
    signUpUser,
    loginUser,
    checkAuth,
    updateProfile
}
