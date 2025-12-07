import mongoose from "mongoose";
import User from "../Models/user.model.js";
import Message from "../Models/MessagesModel.js"
export const searchContact = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        const userId = req.userId;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is required")
        }
        const sanitizeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizeSearchTerm, "i")
        const contacts = await User.find({
            $and: [
                { _id: { $ne: userId } },
                {
                    $or: [{ firstname: regex }, { lastname: regex }, { email: regex }]
                }
            ],

        })
        return res.status(200).json({ contacts });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}

export const getContactForDmList = async (req, res) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receipent: userId }],
                },
            },
            {
                $sort: { timeStamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receipent",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timeStamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstname: "$contactInfo.firstname",
                    lastname: "$contactInfo.lastname",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: {
                    lastMessageTime: -1
                }
            }

        ])
        return res.status(200).json({ contacts });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}
// for channel
export const getAllContacts = async (req, res) => {
    try {
        //get all users which is not equal to current login user
        const users = await User.find({ _id: { $ne: req.userId } }, "firstname lastname _id email");
        const contacts = users.map((user) => ({
        label: user.firstname ? `${user.firstname} ${user.lastname}` : `${user.email}`,
        value:user._id
        }));

        return res.status(200).json({ contacts });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}
