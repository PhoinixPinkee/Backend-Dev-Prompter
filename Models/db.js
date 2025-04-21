const mongoose=require('mongoose');
require('dotenv').config();
const db=process.env.MONGO_URI;
const connectDb=async()=>{
    try{
        await mongoose.connect(db,{});
        console.log('MongoDB Connected');
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}
exports.connectDb=connectDb;