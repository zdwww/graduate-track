import express from "express";

import { connectDB } from "./db.js";
import applicationsRouter from "./routers/applications.js";
import contactsRouter from "./routers/contacts.js";
import usersRouter from "./routers/users.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", applicationsRouter);
app.use("/api", contactsRouter);
app.use("/api", usersRouter);

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
