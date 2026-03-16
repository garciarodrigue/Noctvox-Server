import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({

userId:String,

messages:[
{
role:String,
content:String,
timestamp:{
type:Date,
default:Date.now
}
}
]

});

export default mongoose.model("Conversation",ConversationSchema);
