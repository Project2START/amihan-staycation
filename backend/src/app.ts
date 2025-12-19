import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import registreeRoutes from "./modules/registree/registree.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

import session from "express-session";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Strong_Secret_Key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/api/registree", registreeRoutes);
app.use("/api/user", userRoutes);

async function setUpGraphql() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));
}

setUpGraphql();

app.use(globalErrorHandler);

export default app;
