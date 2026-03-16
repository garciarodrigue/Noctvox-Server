import { askAI } from "./ai.js";
import { webSearch } from "./search.js";
import { getWeather } from "./weather.js";
import { getNews } from "./news.js";

export async function runAgent(prompt){

  const system = `
Eres un agente inteligente conectado a internet.

Herramientas disponibles:

search(query) → buscar información en internet
weather(city) → obtener clima actual
news(topic) → obtener noticias recientes

REGLAS:

1. Si la pregunta requiere información actual debes usar herramientas.
2. Nunca digas que no puedes acceder a internet.
3. Usa news() para noticias.
4. Usa weather() para clima.
5. Usa search() para información general reciente.

Si necesitas usar herramienta responde SOLO con JSON:

{
 "tool":"search",
 "input":"consulta"
}

Si no necesitas herramienta responde normalmente.
`;

  const decision = await askAI([
    {
      role:"system",
      content:system
    },
    {
      role:"user",
      content:`Pregunta del usuario: ${prompt}`
    }
  ]);

  let toolCall;

  try{
    toolCall = JSON.parse(decision.content);
  }catch{
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
      content:"Usa los datos entregados por la herramienta para responder claramente."
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
