import fetch from "node-fetch";

export async function askAI(messages){

  const res = await fetch(
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

  const data = await res.json();

  return data.choices?.[0]?.message;

}
