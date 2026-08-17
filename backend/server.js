import "dotenv/config";

import express from "express";
import cors from "cors";
import notesRouter from "./routes/notesRoutes.js";
import accountsRoutes from "./routes/accountsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/notes", notesRouter);

// =====================================================
// TEST
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "DebtCollect API is running",
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `🚀 DebtCollect API running on http://localhost:${PORT}`
  );
});