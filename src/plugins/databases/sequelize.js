import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL } from 'url'

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";

  const sequelize = new Sequelize(config.uri, config.options);
  try {
    await sequelize.authenticate();
    fastify.log.info("Connected to MYSQL");
    mysqlStatus = "connected";
    fastify.decorate("sequelize", sequelize);

    //Deal with models
    const models = {};
    const modelPaths = pathToFileURL(path.resolve("src/models/sequelize"));
    const modelFiles = await readdir(modelPaths);

    for (const file of modelFiles) {
      if (file.endsWith(".js")) {
        const model = (await import(modelPaths.href + "/" + file)).default(
          sequelize,
          Sequelize.DataTypes
        );
        models[model.name] = model;
        fastify.log.info(`Sequelize model ${model.name} loaded`);
      }
    }

    Object.values(models).forEach((model) => {
      if (model.associate) {
        fastify.log.info(`Sequelize model ${model.name} associated`);
        model.associate(models);
      }
    })

    await sequelize.sync({alter:false})
    fastify.log.info("Sequelize Models synced succesfully");
    fastify.decorate("models", models);
  } catch (err) {
    fastify.log.error("Unable to connect to MYSQL");
    throw err;
  }
  fastify.decorate("mysqlStatus", () => mysqlStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mysqlStatus = "disconnected";
    await sequelize.close();
    done();
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });
