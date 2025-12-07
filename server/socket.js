import { Server as SocketIOServer } from "socket.io";
import Message from "./Models/MessagesModel.js";
import Channel from "./Models/ChannelModel.js"
const setUpSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map();

    // when user disconnect from, removing from userSocketMap
    const disconnect = (socket) => {
        console.log("user disconnected", socket.id);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    // this if for fetching of userid and socketid from usercoketmap when user send message from front end , so the sender is recepient is comming from front end
    const sendMessage = async (message) => {
        console.log("sendMessage received:", message);
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const receipentSocketId = userSocketMap.get(message.receipent);

            console.log("Sender ID:", message.sender, "=> Socket:", senderSocketId);
            console.log("Recipient ID:", message.receipent, "=> Socket:", receipentSocketId);
            const createMessage = await Message.create(message);
            console.log("Message saved to DB:", createMessage);
            const messageData = await Message.findById(createMessage._id).populate("sender", "id email firstname lastname image color").populate("receipent", "id email firstname lastname image color");;


            // Send to recipient (if online)
            if (receipentSocketId) {
                console.log("recpientid", receipentSocketId)
                io.to(receipentSocketId).emit("receiveMessage", messageData);
            }

            // Send to sender (to update their own chat UI instantly)
            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    }

    const sendChannelMessage = async (message) =>{
       const {channelId,sender,content,messageType, fileUrl} = message
       const createMessage = await Message.create({
        sender,
        receipent:null,
        content,
        messageType,
        timeStamp:new Date(),
        fileUrl,
       })

       const messageData = await Message.findById(createMessage._id).populate("sender", "id email firstname lastname image color").exec();

       await Channel.findByIdAndUpdate(channelId,{
        $push:{messages:createMessage._id}
       });
       
       const channel = await Channel.findById(channelId).populate("members");

       const finalData =  {...messageData._doc, channelId:channel._id}

       if(channel && channel.members){
        channel.members.forEach((member)=>{
            const memberSocketId = userSocketMap.get(member._id.toString());
            if(memberSocketId){
                io.to(memberSocketId).emit("recieve-channel-message", finalData);
            }      
        });
         const adminSocketId = userSocketMap.get(channel.admin._id.toString());
             if(adminSocketId){
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
            }
       }
    }


    // whenver we will be connecting with sockets we will be sending userID from frontend
    io.on("connection", (socket) => {
        console.log("New socket connected:", socket.id, socket.handshake.query);
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`user connected: ${userId} with socket ID: ${socket.id}`)
        }
        else {
            console.log("user id is not provided during connection...")
        }
        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("disconnect", () => disconnect(socket));
    })
}
export default setUpSocket;