import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import contractorRoutes from "./routes/contractor.js";
import roofAnalysisRoutes from "./routes/roofAnalysis.js";
import quoteRoutes from "./routes/quotes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);
app.use("/contractor", contractorRoutes);
app.use("/roof-analysis", roofAnalysisRoutes);
app.use("/quotes", quoteRoutes);

// Global error handler
app.use(errorHandler);

export default app;
