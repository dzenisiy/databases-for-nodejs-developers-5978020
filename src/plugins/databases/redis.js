import fp from "fastify-plugin";
import Redis from "ioredis";

async function redisPlugin(fastify, config) {
  let redisStatus = "no started";

  try {
    const redis = new Redis(config.host, config.port);
    redisStatus = "connected";
    fastify.log.info("Connected to redis")
    fastify.decorate("redis", redis);
  } catch (err) {
    fastify.log.error("Failed to connect to redis");
    throw err;
  }

  fastify.decorate("redisStatus", () => redisStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "closed";
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });
