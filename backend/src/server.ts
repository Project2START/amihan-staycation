import { expressMiddleware } from "@as-integrations/express5";
import app, { httpServer, server } from "./app";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { createContext } from "./graphql/context";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => createContext({ req }),
    }),
  );

  app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(globalErrorHandler);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
