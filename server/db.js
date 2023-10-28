const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect(`mongodb+srv://prabhat:${process.env.pass}@cluster0.nob5hjt.mongodb.net/parking_lot_version2?retryWrites=true&w=majority`
, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
module.exports={
    connection
}