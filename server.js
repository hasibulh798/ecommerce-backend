import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// dot env config
dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//database connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes import
import testRoute from "./routes/testRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// route
app.use("/api/v1", testRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome to node server</h1>");
});

// port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `server running on port ${process.env.PORT} on ${process.env.NODE_ENV} mode`
      .bgMagenta.white
  );
});
