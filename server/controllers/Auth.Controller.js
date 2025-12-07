import { compare } from "bcrypt";
import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from 'fs'

const maxAgeSeconds = 3 * 24 * 60 * 60; // 3 days in seconds


const createToken = ({ email, userId }) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAgeSeconds });
}

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }


        const user = await User.create({ email, password });
        res.cookie("jwt", createToken({ email: user.email, userId: user._id }),
            {
                maxAgeSeconds,
                secure: true, // Set to true if using HTTPS
                sameSite: 'none',
            }
        );
        console.log("Received signup request:", { email, password });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                userId: user._id,
                email: user.email,
                profileSetup: user.profilesetup,
            },
            success: true
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message // optional, remove in production if sensitive
        });
    }
}

// login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User with this email does not exist",
                success: false
            });
        }

        const auth = await compare(password, existingUser.password);
        if (!auth) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }
        const user = existingUser;
        // Set the JWT token in the cookie
        res.cookie("jwt", createToken({ email: user.email, userId: user._id }),
            {
                maxAgeSeconds,
                secure: true,
                sameSite: 'none',
            }
        );
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                userId: user._id,
                email: user.email,
                profileSetup: user.profilesetup,
                firstName: user.firstname,
                lastName: user.lastname,
                image: user.image,
                color: user.color
            },
            success: true
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// getuserinfo
export const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).send("user with the given not found");
        }

        res.status(200).json({
            user: {
                userId: userData._id,
                email: userData.email,
                profileSetup: userData.profilesetup,
                firstName: userData.firstname,
                lastName: userData.lastname,
                image: userData.image,
                color: userData.color

            }

        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
//update profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, color } = req.body;
        console.log(firstName, lastName, color)
        if (!firstName || !lastName || color == null) {
            return res.status(400).send("Firstname, lastname and color is required");
        }
        const userData = await User.findByIdAndUpdate(userId, {
            firstname: firstName, lastname: lastName, color, profilesetup: true
        }, { new: true, runValidators: true });

        res.status(200).json({
            message: "profile updated successfuly",
            success: true,
            user: {
                userId: userData._id,
                email: userData.email,
                profileSetup: userData.profilesetup,
                firstName: userData.firstname,
                lastName: userData.lastname,
                image: userData.image,
                color: userData.color
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
}

// add profile image
export const addProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).send("File is required");
        }
        const date = Date.now();
        const fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(req.userId, { image: fileName }, { new: true, runValidators: true });

        res.status(200).json({
            message: "profile uploaded successfuly",
            success: true,
            image: updatedUser.image
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// remove profile image
export const removeProfileImage = async (req, res) => {

    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        }
        if (user.image) {
            unlinkSync(user.image) // user.image is just path ,upload and profile folder
        }
        user.image = null;
        await user.save();

        return res.status(200).json({ success: true, message: "profile image removed successfuly" })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}

//Logout

// remove profile image
export const logOut = async (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" })

        return res.status(200).json({ success: true, message: "Logout successfull" })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}