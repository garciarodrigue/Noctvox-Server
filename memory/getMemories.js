import Memory from "../models/Memory.js";

export async function getMemories(userId){

const memories = await Memory
.find({userId})
.sort({createdAt:-1})
.limit(5);

return memories.map(m=>m.memory);

}
