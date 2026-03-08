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
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import { getVerifiedUserFromSocket } from "./shared/helpers/getVerifiedUserFromSocket";
import { notificationRepository } from "./modules/notification/repositories/notification.repository";
const app = express();

app.use(cors({ origin: process.env.FRONTEND_HOST, credentials: true }));

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

export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_HOST, credentials: true },
});

io.on("connection", (socket: Socket) => {
  socket.on("subscribe", async (data) => {
    const user = getVerifiedUserFromSocket(socket);

    if (data.type === "notifications") {
      socket.join(`notifications:${user.user_id}`);

      const unreadNotifCount =
        await notificationRepository.countUnreadByDestination(
          user.user_id ?? "",
        );

      socket.emit("notification:unread-count", { count: unreadNotifCount });
    }
  });
});

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
