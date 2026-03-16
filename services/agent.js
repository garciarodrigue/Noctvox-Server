import { askAI } from "./ai.js";
import { webSearch } from "./search.js";
import { getWeather } from "./weather.js";
import { getNews } from "./news.js";

import { addMessage,getConversation } from "../memory/memoryManager.js";

function extractJSON(text){

const cleaned = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

try{
return JSON.parse(cleaned);
}catch{
return null;
}

}

export async function runAgent(userId,prompt){

await addMessage(userId,"user",prompt);

const conversation = await getConversation(userId);

const system = `
Eres SYPH NVX, el asistente personal de Sypherion.

Tu comportamiento:

• Inteligente
• Preciso
• Profesional
• Usas herramientas cuando es necesario
• Tienes acceso a internet

Herramientas:

search(query)
weather(city)
news(topic)

Si necesitas herramienta responde SOLO con JSON.

Ejemplo:

{
 "tool":"search",
 "input":"Guatemala noticias"
}
`;

const decision = await askAI([
{
role:"system",
content:system
},
...conversation.messages.slice(-10)
]);

const toolCall = extractJSON(decision.content);

let toolResult=null;

if(toolCall){

if(toolCall.tool==="search")
toolResult=await webSearch(toolCall.input);

if(toolCall.tool==="weather")
toolResult=await getWeather(toolCall.input);

if(toolCall.tool==="news")
toolResult=await getNews(toolCall.input);

}

const final = await askAI([
{
role:"system",
content:"Responde usando la información disponible."
},
...conversation.messages.slice(-10),
{
role:"assistant",
content:`Datos externos: ${JSON.stringify(toolResult)}`
}
]);

await addMessage(userId,"assistant",final.content);

return final.content;

}
