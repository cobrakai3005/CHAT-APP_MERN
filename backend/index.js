const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config();

const dbConnect = require("./db");

const http = require("http");
const app = require("./app.js");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});
const onlineUsers = {}; // or export from a utils file
const getSocketId = (recieverEmail) => {
  return onlineUsers[recieverEmail];
};

const Chat = require("./models/chat.model.js");
const Message = require("./models/message.model.js");
const User = require("./models/user.model.js");

io.on("connection", (socket) => {
  socket.on("addUser", (data) => {
    onlineUsers[data.email] = socket.id;
  });

  socket.on("typing", ({ senderEmail, receiverEmail }) => {
    const receiverSocketId = getSocketId(receiverEmail);
    io.to(receiverSocketId).emit("typing", senderEmail);
  });

  socket.on("stop_typing", ({ senderEmail, receiverEmail }) => {
    const receiverSocketId = getSocketId(receiverEmail);
    io.to(receiverSocketId).emit("stop_typing", senderEmail);
  });

  socket.on(
    "new_message",
    async ({ message, media, senderEmail, receiverEmail }) => {
      console.log("Message, New MWessage");
      const reciever = await User.findOne({ email: receiverEmail });
      const sender = await User.findOne({ email: senderEmail });

      const senderId = sender._id;
      const recieverId = reciever._id;
      let chat = await Chat.findOne({
        participants: { $all: [senderId, recieverId] },
      });
      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, recieverId],
        });
      }
      let newMessage = await Message.create({
        senderId,
        media: media === undefined ? undefined : media,
        recieverId,
        text: message,
        chat: chat._id,
      });
      newMessage = await newMessage.populate("senderId recieverId");

      const recieverSocketId = getSocketId(receiverEmail);
      const senderSocketId = getSocketId(sender.email);

      io.to([senderSocketId, recieverSocketId]).emit(
        "recieve_message",
        newMessage,
        media
      );
    }
  );

  io.emit("onlineUsers", onlineUsers);

  socket.on("sending-video-link", ({ roomId, from, to }) => {
    const senderSocketId = getSocketId(from);
    const recieverSocketId = getSocketId(to);
    io.to(recieverSocketId).emit("recieved-video-link", { roomId, from, to });
  });

  socket.on("disconnect", () => {
    const email = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    delete onlineUsers[email];
    io.emit("onlineUsers", onlineUsers);
  });
});
const { notFound, errorHandler } = require("./middleware/error.middleware.js");

app.use(notFound);
app.use(errorHandler);
server.listen(3000, async () => {
  await dbConnect();
  console.log(`Server is running on port 3000`.cyan.bold);
});

// module.exports = { onlineUsers, getSocketId };
