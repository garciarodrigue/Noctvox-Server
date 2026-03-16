import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

fastify.get("/", async (request, reply) => {
  return {
    status: "online",
    core: "Sypherion Node",
    message: "Servidor Fastify funcionando"
  };
});

fastify.get("/ping", async () => {
  return { pong: true };
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000;

    await fastify.listen({
      port,
      host: "0.0.0.0"
    });

    console.log("Servidor corriendo en puerto", port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
