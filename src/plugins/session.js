import fp from "fastify-plugin";
import fastifySecureSession from "@fastify/secure-session";

async function sessionPlugin(fastify, config) {
  // Fetch the encryption key from environment variables or config
  const secret = config.secret;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is required for secure sessions."
    );
  }

  // Register the fastify-secure-session plugin
  fastify.register(fastifySecureSession, {
    key: Buffer.from(secret, "base64"), // Convert the base64-encoded string to a Buffer
    cookie: {
      path: "/",
      httpOnly: true, // Accessible only via HTTP
      secure: false, // Set true in production with HTTPS
      maxAge: 3600 // 1-hour session expiration
    }
  });

  // Decorate for clearing session
  fastify.decorate("clearSession", (req) => {
    req.session.delete();
  });

  // Add a preHandler hook to populate template variables
  fastify.addHook("preHandler", async (req, reply) => {
    const user = req.session.get("user");
    const messages = req.session.get("messages") || [];

    reply.locals = {
      ...(reply.locals || {}),
      currentUser: user || null, // Set currentUser
      messages // Add messages to locals
    };
  });

  // Clear messages only after the response is sent
  fastify.addHook("onSend", async (req, reply, payload) => {
    req.session.set("messages", []); // Clear messages only after response is sent
    return payload;
  });
}

export default fp(sessionPlugin, { name: "session-plugin" });
