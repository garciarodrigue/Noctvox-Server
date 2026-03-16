import Fastify from "fastify";
import fetch from "node-fetch";

const fastify = Fastify({
  logger: true
});

/* RUTA PRINCIPAL */

fastify.get("/", async () => {
  return {
    status: "online",
    core: "SYPH//NVX",
    message: "Servidor activo"
  };
});

/* RUTA PING (para UptimeRobot) */

fastify.get("/ping", async () => {
  return { pong: true };
});

/* RUTA HEALTH */

fastify.get("/health", async () => {
  return {
    status: "ok",
    uptime: process.uptime()
  };
});

/* RUTA IA */

fastify.post("/ai", async (request, reply) => {

  const { prompt } = request.body;

  if (!prompt) {
    return { error: "Prompt requerido" };
  }

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openchat/openchat-3.5-0106:free",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    const aiResponse =
      data.choices?.[0]?.message?.content || "No response";

    return {
      prompt,
      response: aiResponse
    };

  } catch (error) {

    fastify.log.error(error);

    return {
      error: "Error consultando IA"
    };

  }

});

/* INICIAR SERVIDOR */

const start = async () => {

  try {

    const port = process.env.PORT || 3000;

    await fastify.listen({
      port,
      host: "0.0.0.0"
    });

    console.log("Servidor activo en puerto", port);

  } catch (err) {

    fastify.log.error(err);
    process.exit(1);

  }

};

start();
