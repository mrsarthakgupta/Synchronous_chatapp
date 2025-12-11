# 📱 **Synchronous ChatApp — Real-Time MERN Messaging Platform**

A fast, modern, and real-time chat application built with the MERN stack and Socket.io.  
Designed to deliver a **WhatsApp-like chatting experience** — instant messages, clean UI, and seamless state management.

## 🌐 **Live Demo**

🔗 **Frontend:** https://synchronous-chatapp.vercel.app  
🔗 **Backend API:** https://synchronous-chatapp-3npb.onrender.com  

## ✨ **Features**

### 💬 Real-Time Messaging
- Instant **one-to-one chat** via Socket.io  
- Real-time message delivery & updates  
- User online/offline presence indicators  

### 👤 Authentication & Users
- JWT + cookies for secure login/signup  
- User profile picture upload (Cloud upload ready)  
- Persistent login sessions  

### 📁 Media & Attachments
- Send images, files, and attachments  
- Update profile images  
- Message previews with media indicators  

### 👥 Conversations
- Contact list with last message preview  
- Group chat / channel creation support  
- Timestamps, indicators, smooth transitions  

### 🎨 Modern UI/UX
- Fully responsive design (mobile-first)  
- Tailwind + Shadcn components  
- Lottie animations, icons, soft transitions  
- Clean WhatsApp-style layout  

### ⚡ Performance & Backend
- MongoDB aggregation for optimized queries  
- Socket.io rooms for targeted messaging  
- Redux Toolkit + RTK Query for clean global state  


## 🧰 **Tech Stack**

### **Frontend**
- React  
- Tailwind CSS  
- Shadcn UI  
- Redux Toolkit (RTK)  
- RTK Query  
- Axios  
- Lottie  
- Lucide Icons  

### **Backend**
- Node.js  
- Express.js  
- Socket.io  
- JWT  
- Cookie-parser  
- CORS  

### **Database**
- MongoDB Atlas (Aggregation Pipelines)

---
## 📡 Socket.io Events (Quick Overview)

| Event | Direction | Description |
|--------|-----------|-------------|
| **user-connected** | client ➝ server | Notify that a user is online |
| **join-room** | client ➝ server | Join a private chat room |
| **send-message** | client ➝ server | Emit a message to another user |
| **receive-message** | server ➝ client | Receive a new message instantly |
| **typing** | client ➝ server | Emit typing indicator |
| **typing-start / typing-stop** | server ➝ client | Show typing animation |

---
## 📁 Folder Structure

<details>
<summary><strong>📦 Click to expand the full project structure</strong></summary>

    Synchronous_chatapp/
    │
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── features/
    │   │   ├── pages/
    │   │   ├── store/
    │   │   └── App.jsx
    │   ├── public/
    │   └── package.json
    │
    └── server/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middleware/
        ├── socket/
        ├── server.js
        └── package.json

</details>

## 🧭 Roadmap / Future Improvements
  - Group video/audio calls (WebRTC)
  - Message read receipts (double-ticks like WhatsApp)
  - Block / unblock users
  - Story / status feature
  - Voice message recording
  - “Online recently” timestamp
  - Dark mode toggle
  - Emoji picker + GIF search
  - Message reactions

## 💡 Tips for Reviewers / Recruiters
  - Real-time communication is implemented cleanly using Socket.io rooms
  - Global state is structured using Redux Toolkit + RTK Query
  - UI follows modern SaaS styling using Shadcn + Tailwind
  - MongoDB uses aggregation pipelines for optimized chat retrieval

## 🎯 Summary

A real-time MERN chat application featuring secure auth, instant messaging with Socket.io, media sharing, and a modern responsive UI.  
Built to demonstrate practical full-stack skills and real-world application design.

## ⭐ **Author**
**Sarthak Gupta**  
Full Stack Developer | MERN | Real-time Systems | Cloud Deployments  

If you like this project, feel free to ⭐ star the repo and explore more of my work.
