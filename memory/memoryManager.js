import Conversation from "../models/Conversation.js";

export async function getConversation(userId){

let convo = await Conversation.findOne({userId});

if(!convo){

convo = await Conversation.create({
userId,
messages:[]
});

}

return convo;

}

export async function addMessage(userId,role,content){

const convo = await getConversation(userId);

convo.messages.push({
role,
content
});

await convo.save();

return convo.messages;

}
