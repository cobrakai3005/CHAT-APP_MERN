const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongdb Database Connected ${conn.connection.host}`.rainbow);
  } catch (error) {
    console.log(error.message);
    console.log(`Error in Connecting Database`);
  }
};

module.exports = dbConnect;
