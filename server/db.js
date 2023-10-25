const mongoose=require("mongoose")

const connection=mongoose.connect("mongodb+srv://prabhat:prabhat@cluster0.nob5hjt.mongodb.net/parking_lot_version2?retryWrites=true&w=majority"
, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
module.exports={
    connection
}