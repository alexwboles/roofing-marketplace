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

// ROUTES
app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);
app.use("/contractor", contractorRoutes);
app.use("/roof-analysis", roofAnalysisRoutes);
app.use("/quotes", quoteRoutes);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
