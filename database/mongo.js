import mongoose from "mongoose";

export async function connectDB(){

const uri = process.env.MONGO_URI;

await mongoose.connect(uri,{
useNewUrlParser:true,
useUnifiedTopology:true
});

console.log("MongoDB conectado");

}
