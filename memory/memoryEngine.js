import Memory from "../models/Memory.js";
import { askMemory } from "../services/aiMemory.js";

export async function processMemory(userId,userPrompt,aiResponse){

const system = `
Analiza la conversación y decide si hay información importante
que deba guardarse como memoria permanente.

Responde SOLO en JSON.

Ejemplo:

{
 "memory":"El usuario vive en Guatemala"
}

Si no hay memoria importante responde:

{
 "memory":null
}
`;

const analysis = await askMemory([
{role:"system",content:system},
{
role:"user",
content:`
Usuario: ${userPrompt}

IA: ${aiResponse}
`
}
]);

let json;

try{

json = JSON.parse(
analysis.content
.replace(/```json/g,"")
.replace(/```/g,"")
);

}catch{

return;

}

if(!json.memory) return;

await Memory.create({

userId,
memory:json.memory

});

console.log("Memoria guardada:",json.memory);

}
