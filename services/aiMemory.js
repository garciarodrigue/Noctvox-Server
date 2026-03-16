export async function askMemory(messages){

const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${process.env.AI_KEY_MEMORY}`
},

body:JSON.stringify({

model:"openrouter/auto",

messages

})

});

const data = await res.json();

return data.choices?.[0]?.message || {content:"{}"};

}
