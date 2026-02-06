import dotenv from "dotenv";
import http from "http";

dotenv.config();

import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
