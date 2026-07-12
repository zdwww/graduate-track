import express from "express";
import passport from "passport";

import "./config/passport.js";
import { connectDB } from "./db.js";
import applicationsRouter from "./routers/applications.js";
import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

const app = express();
const PORT = 3000;

const ALLOWED_ORIGINS = ["http://localhost:5174"]; // TODO: add production url here

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});
app.use(express.json());
app.use(passport.initialize());
app.use("/api", applicationsRouter);
app.use("/api", authRouter);
app.use("/api", contactsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening 3000...");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
