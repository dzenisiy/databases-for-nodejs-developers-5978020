export default async function (fastify) {
  // Route to display basket contents
  fastify.get("/", async (request, reply) => {
    // Fetch session messages
    const messages = request.session.get("messages") || [];
    request.session.set("messages", []); // Clear messages after retrieval

    // Placeholder for fetching basket contents from Redis
    fastify.log.info("Fetching basket contents.");

    return reply.view("basket.ejs", {
      title: "Your Basket",
      currentPath: "/basket",
      items: [], // Items will be fetched from Redis later
      messages
    });
  });

  // Route to add an item to the basket
  fastify.post("/add", async (request, reply) => {
    const { sku, quantity } = request.body;

    // Log the action
    fastify.log.info(`Adding item with SKU: ${sku}, quantity: ${quantity}`);

    // Add a success message to the session
    request.session.set("messages", [
      {
        type: "success",
        text: `Item with SKU: ${sku} was added to the basket.`
      }
    ]);

    // Redirect back to the referring page or the basket page
    return reply.redirect(request.headers.referer || "/basket");
  });

  // Route to remove an item from the basket
  fastify.post("/remove", async (request, reply) => {
    const { sku } = request.body;

    // Log the action
    fastify.log.info(`Removing item with SKU: ${sku}`);

    // Add a success message to the session
    request.session.set("messages", [
      {
        type: "success",
        text: `Item with SKU: ${sku} was removed from the basket.`
      }
    ]);

    // Redirect back to the referring page or the basket page
    return reply.redirect(request.headers.referer || "/basket");
  });

  // Route to buy all items in the basket
  fastify.post("/buy", async (request, reply) => {
    // Log the action
    fastify.log.info("Processing basket purchase...");

    // Add a success message to the session
    request.session.set("messages", [
      {
        type: "success",
        text: "Thank you for your purchase! Your basket has been processed."
      }
    ]);

    // Redirect to a confirmation page
    return reply.redirect("/confirmation");
  });

  // Route to clear the basket
  fastify.post("/clear", async (request, reply) => {
    // Log the action
    fastify.log.info("Clearing all items from the basket.");

    // Add a success message to the session
    request.session.set("messages", [
      { type: "success", text: "Your basket has been cleared." }
    ]);

    // Redirect back to the referring page or the basket page
    return reply.redirect(request.headers.referer || "/basket");
  });
}
