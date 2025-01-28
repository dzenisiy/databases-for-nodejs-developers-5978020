import fp from "fastify-plugin";

async function mongoosePlugin(fastify, config) {
  let mongoStatus = "disconnected";

  // Makes the current connection status available to other plugins
  // This is used to show the connection status on the home page
  fastify.decorate("mongoStatus", () => mongoStatus);

  // TODO: Connect to MongoDB

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mongoStatus = "disconnected";
    // TODO: Close MongoDB connection
    done();
  });
}

export default fp(mongoosePlugin, { name: "mongoose-plugin" });
