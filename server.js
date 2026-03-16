import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

/* RUTA PRINCIPAL */
fastify.get("/", async () => {
  return {
    status: "online",
    core: "Sypherion Node"
  };
});

/* RUTA PARA MANTENER DESPIERTO EL SERVER */
fastify.get("/ping", async () => {
  return { pong: true };
});

/* INICIAR SERVIDOR */
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
