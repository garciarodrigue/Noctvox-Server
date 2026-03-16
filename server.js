import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

import aiRoute from "./routes/aiRoute.js";

const fastify = Fastify({logger:true});

fastify.register(fastifyStatic,{
root:path.join(process.cwd(),"public")
});

fastify.register(aiRoute);

const start = async ()=>{

await fastify.listen({
port:process.env.PORT || 3000,
host:"0.0.0.0"
});

};

start();
