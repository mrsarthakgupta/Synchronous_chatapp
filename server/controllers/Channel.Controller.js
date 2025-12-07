import mongoose from "mongoose";
import Channel from "../Models/ChannelModel.js";
import User from "../Models/user.model.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        if (!admin) {
            return res.status(400).send("Admin user not found");
        }

        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({ error: "Some members are invalid" });
        }
        const newChannel = new Channel({
            name, members, admin: userId
        })
        await newChannel.save();
        return res.status(201).json({success:true, channel: newChannel });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels=  await Channel.find({
           $or: [{admin:userId}, {members:userId}],
        }).sort({updatedAt:-1})

        
        return res.status(201).json({success:true, channels });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}