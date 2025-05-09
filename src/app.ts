import express from "express";
import cors from "cors";

// Config
import connectDB from "./config/db";

// Routes
import routes from "./routes/index.routes";
import postRoutes from "./routes/post.route";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import commentRoutes from "./routes/comments.routes";

const app = express();

const BASE_PATH = "/api";

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "https://scores3093-blog.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB
connectDB();

// Routes
app.use(BASE_PATH, routes);
app.use(BASE_PATH, postRoutes);
app.use(BASE_PATH, authRoutes);
app.use(BASE_PATH, categoryRoutes);
app.use(BASE_PATH, commentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running!");
});

export default app;
