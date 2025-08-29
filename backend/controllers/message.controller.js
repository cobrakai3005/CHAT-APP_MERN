const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

const getMessages = expressAsyncHandler(async (req, res) => {
  const { recieverEmail } = req.params;
  const senderId = req.user._id;
  if (!recieverEmail || !senderId) {
    throw new Error("Please Fill All the fields");
  }
  const reciever = await User.findOne({ email: recieverEmail });
  const recieverId = reciever._id;

  const chat = await Chat.findOne({
    participants: { $all: [senderId, recieverId] },
  });
  const messages = await Message.find({ chat: chat?._id }).populate(
    "senderId recieverId"
  );

  return res.status(201).json({ success: true, messages });
});

const createMessage = expressAsyncHandler(async (req, res) => {
  const { message } = req.body;
  const { recieverEmail } = req.params;
  const senderId = req.user._id;
  const reciever = await User.findOne({ email: recieverEmail });
  const recieverId = reciever._id;
  let chat = await Chat.findOne({
    participants: { $all: [senderId, recieverId] },
  });
  if (!chat) {
    chat = await Chat.create({
      participants: [senderId, recieverId],
    });
  }
  const newMessage = await Message.create({
    senderId,
    recieverId,
    text: message,
  });
  chat.messages.push(newMessage._id);
  await chat.save();

  //Socket IO Real Time

  const senderSId = global.getSocketId(req.user.email);
  const recieverSId = global.getSocketId(recieverEmail);
  console.log("sockert id...", senderSId, recieverSId);
  io.to([senderSId, recieverSId]).emit("message", newMessage);
  // ✅ return created message
  return res.status(201).json({ success: true, message: newMessage });
});

module.exports = { getMessages, createMessage };
