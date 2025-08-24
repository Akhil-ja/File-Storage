import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware";
import morgan from "morgan";
import cors from "cors";
import apiRoutes from "./routes/index";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Heloo");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
