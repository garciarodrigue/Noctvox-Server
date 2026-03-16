import Fastify from "fastify";
import aiRoute from "./routes/aiRoute.js";

import { connectDB } from "./database/mongo.js";

const fastify = Fastify({logger:true});

fastify.register(aiRoute);

const start = async()=>{

await connectDB();

await fastify.listen({
port:process.env.PORT || 3000,
host:"0.0.0.0"
});

};

start();
