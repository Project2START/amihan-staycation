// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { config } from "../config";

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, config.jwtSecret);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };
