import { Router } from "express";
import { verifyToken } from "../Middleware/Auth.Middleware.js";
import { createChannel, getUserChannels } from "../controllers/Channel.Controller.js";

const channelRoutes = Router();

channelRoutes.post('/create-channel', verifyToken, createChannel);
channelRoutes.get('/get-user-channels', verifyToken, getUserChannels);

export default channelRoutes;