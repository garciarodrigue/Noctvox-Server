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
Eres un agente inteligente con acceso a internet.

Herramientas disponibles:

search(query)
→ úsala para buscar información general o eventos recientes.

weather(city)
→ úsala cuando el usuario pregunte por clima, temperatura o condiciones meteorológicas.

news(topic)
→ úsala cuando el usuario pregunte por noticias o eventos actuales.

REGLAS IMPORTANTES:

1. Si la pregunta requiere información actual debes usar una herramienta.
2. Nunca digas que no tienes acceso a internet.
3. Elige la herramienta correcta según la pregunta.

Formato obligatorio si usas herramienta:

{
 "tool":"search",
 "input":"consulta"
}

o

{
 "tool":"weather",
 "input":"ciudad"
}

o

{
 "tool":"news",
 "input":"tema"
}
`;

  const decision = await askAI([
    {role:"system",content:system},
    {role:"user",content:prompt}
  ]);

  const toolCall = extractJSON(decision.content);

  let toolResult = null;

  if(toolCall){

    if(toolCall.tool==="search"){
      toolResult = await webSearch(toolCall.input);
    }

    if(toolCall.tool==="weather"){
      toolResult = await getWeather(toolCall.input);
    }

    if(toolCall.tool==="news"){
      toolResult = await getNews(toolCall.input);
    }

  }

  // fallback automático si la IA no eligió herramienta
  if(!toolResult){
    toolResult = await webSearch(prompt);
  }

  const final = await askAI([
    {
      role:"system",
      content:"Responde usando la información obtenida de internet."
    },
    {
      role:"user",
      content:prompt
    },
    {
      role:"assistant",
      content:`Datos obtenidos: ${JSON.stringify(toolResult)}`
    }
  ]);

  return final.content;

}
