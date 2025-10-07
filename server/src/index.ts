import express from "express";
import cors from "cors";
import userRoutes from "./Routes/UserRouter";
import dashboardRoutes from "./Routes/dashboardRoutes";
import productsRoutes from "./Routes/ProductRoutes";
import productSectionRoutes from "./Routes/ProductSectionRoutes";
import categoryRoutes from "./Routes/CategoryRoutes";
import dotenv from "dotenv";
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://alltechcomp.com",
  "https://www.alltechcomp.com"
  "https://admin.alltechcomp.com",
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  midmponts

app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/productSection", productSectionRoutes);
app.use("/api/category", categoryRoutes);
// Catch-all route for undefined routes (404 handler)
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Catch-all 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    message: "API Not Found",
    status: 404,
  });
});

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
