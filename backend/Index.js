import dotenv from "dotenv";
dotenv.config();

import app from "./App.js";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
