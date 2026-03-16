import Fastify from "fastify";
import aiRoute from "./routes/aiRoute.js";

const fastify = Fastify({logger:true});

fastify.get("/",async()=>{
  return {status:"online"};
});

fastify.get("/ping",async()=>{
  return {pong:true};
});

fastify.register(aiRoute);

const start = async()=>{

  const port = process.env.PORT || 3000;

  await fastify.listen({
    port,
    host:"0.0.0.0"
  });

};

start();
