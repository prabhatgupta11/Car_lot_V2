// routes/parking.js
const express = require('express');
const mongoose=require("mongoose")
const router = express.Router();
const ParkingLot = require('../model/ParkingLotModel'); // Import your Mongoose model
const ParkingHistory = require('../model/ParkingHistoryModel'); // Import your parking history model


router.get("/test",(req,res)=>{
    try{
        res.send("working")

    }catch(err)

    {
        res.send(err.message)
    }
})

// Create a new parking lot
router.post('/parking-lots', async (req, res) => {
    const { name, capacity, rateCard } = req.body;
  
    try {
      const newParkingLot = new ParkingLot({
        name,
        capacity,
        rateCard,
      });
  
      await newParkingLot.save();
  
      res.json(newParkingLot);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create a new parking lot' });
    }
  });
  
  // Get a list of all parking lots
  router.get('/parking-lots', async (req, res) => {
    try {
      const parkingLots = await ParkingLot.find();
      res.json(parkingLots);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve parking lots' });
    }
  });
  
// Route to park a vehicle
router.post('/park', async (req, res) => {
    const { vehicleType, parkingLotId } = req.body;
  
    try {
      const parkingLot = await ParkingLot.findById(parkingLotId);
  
      if (!parkingLot) {
        return res.status(404).json({ error: 'Parking lot not found' });
      }
  
      if (parkingLot.capacity[vehicleType] > 0) {
        parkingLot.capacity[vehicleType]--;
  
        await parkingLot.save();
  
        const parkingHistory = new ParkingHistory({
          parkingLot: parkingLotId,
          vehicleType,
          entryTime: new Date(),
        });
  
        await parkingHistory.save();
  
        res.json({ message: 'Vehicle parked successfully' });
      } else {
        res.status(400).json({ error: 'Parking lot is full for the specified vehicle type' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to park the vehicle' });
    }
  });
  
  

// Route to exit the parking area and calculate charges
router.post('/exit', async (req, res) => {
    const { parkingLotId, vehicleType, vehicleEntryTime } = req.body;
  
    try {
      // Find the parking lot by ID
      const parkingLot = await ParkingLot.findById(parkingLotId);
  
      if (!parkingLot) {
        return res.status(404).json({ error: 'Parking lot not found' });
      }
  
      // Calculate the parking duration in hours
      const entryTime = new Date(vehicleEntryTime);
      const exitTime = new Date();
      const durationInMilliseconds = exitTime - entryTime;
      const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
  
      // Calculate the charge based on vehicle type (you can have different rate cards)
      let charge = 0;
      switch (vehicleType) {
        case 'twoWheeler':
          charge = durationInHours * 5; // Example rate: $5 per hour for two-wheelers
          break;
        case 'hatchbackCar':
          charge = durationInHours * 10; // Example rate: $10 per hour for hatchback cars
          break;
        case 'suvCar':
          charge = durationInHours * 15; // Example rate: $15 per hour for SUV cars
          break;
        default:
          return res.status(400).json({ error: 'Invalid vehicle type' });
      }
  
      // Record exit time and charge in the parking history
      const parkingHistory = new ParkingHistory({
        parkingLot: parkingLotId,
        vehicleType,
        entryTime,
        exitTime,
        amountPaid: charge,
      });
  
      await parkingHistory.save();
  
      res.json({ message: 'Exit successful', amountDue: charge });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process exit' });
    }
  });

  // Route to view parking history for a vehicle
router.get('/history', async (req, res) => {
    const { vehicleType } = req.query;
  
    try {
      // Find parking history entries for the specified vehicle type
      const history = await ParkingHistory.find({ vehicleType });
  
      res.json(history);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch parking history' });
    }
  });


  // Seed initial data for parking lots
const seedParkingLots = async () => {
    const parkingLotsData = [
      {
        name: 'Parking Lot 1',
        capacity: { twoWheeler: 10, hatchbackCar: 20, suvCar: 15 },
        rateCard: { twoWheeler: 5, hatchbackCar: 10, suvCar: 15 },
      },
      {
        name: 'Parking Lot 2',
        capacity: { twoWheeler: 15, hatchbackCar: 30, suvCar: 20 },
        rateCard: { twoWheeler: 6, hatchbackCar: 12, suvCar: 18 },
      },
      {
        name: 'Parking Lot 3',
        capacity: { twoWheeler: 45, hatchbackCar: 10, suvCar: 30 },
        rateCard: { twoWheeler: 15, hatchbackCar: 17, suvCar: 45 },
      },
      
    ];
  
    try {
      for (const data of parkingLotsData) {
        const parkingLot = new ParkingLot(data);
        await parkingLot.save();
      }
      console.log('Parking lots seeded successfully');
    } catch (err) {
      console.error('Error seeding parking lots:', err);
    }
  };
  
  // Run the seeding function
  seedParkingLots();
  

  
module.exports = router;
