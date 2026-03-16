import mongoose from "mongoose";

export async function connectDB(){

const uri = process.env.MONGO_URI;

if(!uri){
throw new Error("MONGO_URI no está definida");
}

try{

await mongoose.connect(uri);

console.log("MongoDB conectado correctamente");

}catch(error){

console.error("Error conectando MongoDB:",error);
process.exit(1);

}

}
