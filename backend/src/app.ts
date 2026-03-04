import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import registreeRoutes from "./modules/registree/registree.routes";
import paymentMethodRoutes from "./modules/paymentMethod/paymentMethod.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import agentRoutes from "./modules/agents/agents.routes";
import { ApolloServer } from "@apollo/server";
import cookieParser from "cookie-parser";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import session from "express-session";
import { resolvers, typeDefs } from "./graphql/schema";
import http from "http";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Strong_Secret_Key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/api/registrees", registreeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/paymentMethods", paymentMethodRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/agents", agentRoutes);

export const httpServer = http.createServer(app);

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export default app;

// async function setUpGraphql() {
//   const server = new ApolloServer({ typeDefs, resolvers });

//   await server.start();

//   app.use(
//     "/graphql",
//     expressMiddleware(server, {
//       context: async ({ req, res }) => {
//         const token =
//           req.cookies?.auth_token ||
//           (req.headers.authorization || "").replace("Bearer ", "");
//         let user = null;
//         if (token) {
//           try {
//             user = verifyToken(token);
//           } catch {
//             user = null;
//           }
//         }
//         return { req, res, user };
//       },
//     }),
//   );
// }

// setUpGraphql();

// export default app;
