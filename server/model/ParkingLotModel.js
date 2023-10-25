// models/ParkingLot.js
const mongoose = require('mongoose');

const parkingLotSchema = mongoose.Schema({
  name: String,
  capacity: {
    twoWheeler: Number,
    hatchbackCar: Number,
    suvCar: Number,
  },
  rateCard: {
    twoWheeler: Number,
    hatchbackCar: Number,
    suvCar: Number,
  },
});

const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);

module.exports = ParkingLot;
