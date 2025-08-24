import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Heloo");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
