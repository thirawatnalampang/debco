import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import notesRouter from "./routes/notesRoutes.js";
import accountsRoutes from "./routes/accountsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Login / Logout
app.use("/api/auth", authRoutes);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// ต้อง Login ก่อนถึงจะเข้าได้
app.use(
  "/api/accounts",
  authMiddleware,
  accountsRoutes
);

app.use(
  "/api/notes",
  authMiddleware,
  notesRouter
);

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