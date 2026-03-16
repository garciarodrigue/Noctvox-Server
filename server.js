import Fastify from "fastify";
import fetch from "node-fetch";

const fastify = Fastify({
  logger: true
});

/* ========================= */
/* RUTA PRINCIPAL */
/* ========================= */

fastify.get("/", async () => {
  return {
    status: "online",
    core: "SYPH//NVX",
    ai: "/ai endpoint ready"
  };
});

/* ========================= */
/* PING */
/* ========================= */

fastify.get("/ping", async () => {
  return { pong: true };
});

/* ========================= */
/* HEALTH */
/* ========================= */

fastify.get("/health", async () => {
  return {
    status: "ok",
    uptime: process.uptime(),
    ai_key_loaded: !!process.env.AI_KEY
  };
});

/* ========================= */
/* DEBUG RUTAS */
/* ========================= */

fastify.get("/routes", async () => {
  return fastify.printRoutes();
});

/* ========================= */
/* IA */
/* ========================= */

fastify.post("/ai", async (request, reply) => {

  fastify.log.info("===== REQUEST /ai RECIBIDO =====");

  try {

    const body = request.body || {};

    fastify.log.info("Body recibido:");
    fastify.log.info(body);

    const prompt = body.prompt;

    if (!prompt) {
      return {
        error: "No se recibió 'prompt'",
        body_recibido: body
      };
    }

    if (!process.env.AI_KEY) {
      return {
        error: "AI_KEY no configurada en Render"
      };
    }

    fastify.log.info("Enviando prompt a OpenRouter...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const text = await response.text();

    fastify.log.info("Respuesta cruda OpenRouter:");
    fastify.log.info(text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return {
        error: "OpenRouter devolvió algo que no es JSON",
        raw_response: text
      };
    }

    const aiResponse =
      data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return {
        error: "OpenRouter no devolvió respuesta válida",
        openrouter_response: data
      };
    }

    return {
      prompt,
      response: aiResponse
    };

  } catch (error) {

    fastify.log.error("ERROR EN /ai");
    fastify.log.error(error);

    return {
      error: "Fallo interno en servidor",
      message: error.message
    };

  }

});

/* ========================= */
/* INICIAR SERVIDOR */
/* ========================= */

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
