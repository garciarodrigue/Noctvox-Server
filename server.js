import Fastify from "fastify";
import aiRoute from "./routes/aiRoute.js";
import { connectDB } from "./database/mongo.js";

const fastify = Fastify({ logger: true });

/* RUTA PRINCIPAL */

fastify.get("/", async () => {
  return {
    status: "online",
    core: "SYPH // NVX",
    message: "Servidor activo"
  };
});

/* RUTA PING */

fastify.get("/ping", async () => {
  return { pong: true };
});

/* RUTA IA */

fastify.register(aiRoute);

const start = async () => {

  await connectDB();

  await fastify.listen({
    port: process.env.PORT || 3000,
    host: "0.0.0.0"
  });

};

start();
