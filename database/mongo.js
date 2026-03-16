import mongoose from "mongoose";

export async function connectDB(){

const uri = process.env.MONGO_URI;

if(!uri){

throw new Error("MONGO_URI no definida");

}

try{

await mongoose.connect(uri);

console.log("MongoDB conectado");

}catch(error){

console.error("Error MongoDB:",error);

process.exit(1);

}

}
