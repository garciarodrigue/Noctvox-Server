import { runAgent } from "../services/agent.js";

export default async function aiRoute(fastify){

  fastify.post("/ai", async (req)=>{

    const {prompt} = req.body;

    if(!prompt){
      return {error:"Prompt requerido"};
    }

    const response = await runAgent(prompt);

    return {
      prompt,
      response
    };

  });

}
