import express from "express";
import passport from "passport";

import "./config/passport.js";
import { connectDB } from "./db.js";
import applicationsRouter from "./routers/applications.js";
import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

const app = express();
const PORT = 3000;

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
