import fetch from "node-fetch";

export async function askAI(messages){

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${process.env.AI_KEY}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model:"openrouter/auto",
        messages
      })
    }
  );

  const data = await response.json();

  if(!data.choices){
    console.log("OpenRouter error:", data);
    return {content:"Error consultando IA"};
  }

  return data.choices[0].message;

}
