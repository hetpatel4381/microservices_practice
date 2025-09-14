const captainModel = require("../models/captain.model");
const blacklisttokenModel = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rabbitMQ = require("../service/rabbit.js");

const pendingRequests = [];

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    const captain = await captainModel.findOne({ email });
    if (captain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newCaptain = new captainModel({ name, email, password: hash });

    await newCaptain.save();

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete newCaptain._doc.password;

    res.cookie("token", token);

    res.send({ token, captain: newCaptain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete captain._doc.password;

    res.cookie("token", token);

    res.send({ token, captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklisttokenModel.create({ token });
    res.clearCookie("token");
    res.send({ message: "Captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.profile = async (req, res) => {
  try {
    delete req.captain._doc.password;
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.waitForNewRise = async (req, res) => {
  try {
    // set timeout for long polling 30 seconds
    req.setTimeout(30000, () => {
      res.status(204).end(); // No content
    });

    // add request object to the pending array
    pendingRequests.push(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

rabbitMQ.subscribeToQueue("new-ride", (data) => {
  const rideData = JSON.parse(data);

  // send the new ride data to all the pending requests
  pendingRequests.forEach((res) => {
    res.json(rideData);
  });

  // clear the pending requests
  pendingRequests.length = 0;
});
