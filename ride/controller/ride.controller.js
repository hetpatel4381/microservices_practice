const rideModel = require("../model/ride.model.js");
const rabbitMQ = require("../service/rabbit.js");

module.exports.createRide = async (req, res) => {
  try {
    
    const { pickup, destination } = req.body;
    const { user } = req;

    const newRide = new rideModel({
      user: user._id,
      pickup,
      destination,
    });

    await newRide.save();
    rabbitMQ.publishToQueue("new-ride", JSON.stringify(newRide));

    res.status(201).json({ ride: newRide });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports.acceptRide = async (req, res) => {
  try {
    const { rideId } = req.query;

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "accepted";
    await ride.save();

    rabbitMQ.publishToQueue("ride-accepted", JSON.stringify(ride));

    res.json({ ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}