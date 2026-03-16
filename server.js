import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./database/mongo.js";
import aiRoute from "./routes/aiRoute.js";

const fastify = Fastify({ logger:true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* FRONTEND */

fastify.register(fastifyStatic,{
root: path.join(__dirname,"public"),
prefix:"/"
});

/* API IA */

fastify.register(aiRoute);

/* RUTA PING */

fastify.get("/ping",async ()=>{
return {pong:true};
});

/* INICIAR SERVIDOR */

const start = async()=>{

await connectDB();

await fastify.listen({
port:process.env.PORT || 3000,
host:"0.0.0.0"
});

console.log("Servidor activo");

};

start();
