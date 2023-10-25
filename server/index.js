const express=require("express")
const mongoose = require('mongoose');
const route = require("./route/parkingRoute");
const app=express()


//database connection

mongoose.connect("mongodb+srv://prabhat:prabhat@cluster0.nob5hjt.mongodb.net/version2_car_lot?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

app.use(express.json());

app.use("/api",route)

app.listen(4500, () => {
  console.log("Server is running at port 4500");
});