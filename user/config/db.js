const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("User Service Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectDB;
