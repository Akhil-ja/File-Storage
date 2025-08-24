import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Heloo");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
