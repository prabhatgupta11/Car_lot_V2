
const mongoose = require('mongoose');

const parkingHistorySchema =  mongoose.Schema({
  parkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLot',
  },
  vehicleType: String,
  entryTime: Date,
  exitTime: Date,
  amountPaid: Number,
});

const ParkingHistory = mongoose.model('ParkingHistory', parkingHistorySchema);

module.exports = ParkingHistory;
