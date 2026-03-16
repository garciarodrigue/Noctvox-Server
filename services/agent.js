import { askAI } from "./ai.js";
import { webSearch } from "./search.js";
import { getWeather } from "./weather.js";
import { getNews } from "./news.js";

export async function runAgent(prompt){

  const system = `
Eres un agente inteligente.

Puedes usar herramientas:

search(query)
weather(city)
news(topic)

Si necesitas información responde SOLO con JSON:

{
 "tool":"search",
 "input":"consulta"
}

o weather o news.

Si no necesitas herramientas responde normalmente.
`;

  const decision = await askAI([
    {role:"system",content:system},
    {role:"user",content:prompt}
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

  const finalAnswer = await askAI([
    {
      role:"system",
      content:"Usa los datos de la herramienta para responder con un resumen claro."
    },
    {
      role:"user",
      content:prompt
    },
    {
      role:"assistant",
      content:`Datos herramienta: ${JSON.stringify(toolResult)}`
    }
  ]);

  return finalAnswer.content;

}
