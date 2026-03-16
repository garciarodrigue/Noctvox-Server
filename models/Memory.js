import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema({

userId:String,

memory:String,

createdAt:{
type:Date,
default:Date.now
}

});

export default mongoose.model("Memory",MemorySchema);
