import { askMain } from "./aiMain.js";
import { webSearch } from "./search.js";
import { getWeather } from "./weather.js";
import { getNews } from "./news.js";

import { getMemories } from "../memory/getMemories.js";
import { processMemory } from "../memory/memoryEngine.js";

function extractJSON(text){

const cleaned=text
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

const memories = await getMemories(userId);

const system = `
Eres SYPH NVX.

Asistente avanzado.

Tienes acceso a herramientas:

search(query)
weather(city)
news(topic)

Memorias importantes del usuario:

${memories.join("\n")}

Si necesitas usar herramienta responde SOLO JSON.

Ejemplo:

{
 "tool":"search",
 "input":"Guatemala noticias"
}
`;

const decision = await askMain([
{role:"system",content:system},
{role:"user",content:prompt}
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

const final = await askMain([
{
role:"system",
content:"Responde usando datos externos si existen."
},
{
role:"assistant",
content:`Datos externos: ${JSON.stringify(toolResult)}`
},
{
role:"user",
content:prompt
}
]);

await processMemory(userId,prompt,final.content);

return final.content;

}
