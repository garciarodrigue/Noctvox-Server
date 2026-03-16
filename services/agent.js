import { askAI } from "./ai.js";
import { webSearch } from "./search.js";
import { getWeather } from "./weather.js";
import { getNews } from "./news.js";

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

export async function runAgent(prompt){

  const system = `
Eres un agente inteligente conectado a internet.

Herramientas disponibles:

search(query)
weather(city)
news(topic)

Reglas:

Si necesitas usar una herramienta responde SOLO con JSON.

Ejemplo:

{
 "tool":"news",
 "input":"Guatemala"
}
`;

  const decision = await askAI([
    {role:"system",content:system},
    {role:"user",content:prompt}
  ]);

  const toolCall = extractJSON(decision.content);

  if(!toolCall){
    return decision.content;
  }

  let toolResult = null;

  if(toolCall.tool==="search"){
    toolResult = await webSearch(toolCall.input);
  }

  if(toolCall.tool==="weather"){
    toolResult = await getWeather(toolCall.input);
  }

  if(toolCall.tool==="news"){
    toolResult = await getNews(toolCall.input);
  }

  const final = await askAI([
    {
      role:"system",
      content:"Responde usando la información obtenida de la herramienta."
    },
    {
      role:"user",
      content:prompt
    },
    {
      role:"assistant",
      content:`Datos: ${JSON.stringify(toolResult)}`
    }
  ]);

  return final.content;

}
