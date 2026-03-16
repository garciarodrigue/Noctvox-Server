import { runAgent } from "../services/agent.js";

export default async function aiRoute(fastify){

fastify.post("/ai",async(req)=>{

const {prompt,userId} = req.body;

const response = await runAgent(userId || "default",prompt);

return {
response
};

});

}
