import bcrypt from "bcryptjs";

import passport from "../config/passport.js";
import { createUser, findUserByEmail } from "../models/Users.js";
import { signToken } from "../utils/token.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toPublicUser(user) {
  return { id: user._id, email: user.email, name: user.name };
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email: normalizedEmail, passwordHash });

  const token = signToken(user);
  return res.status(201).json({ token, user: toPublicUser(user) });
};

export const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid email or password" });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user: toPublicUser(user) });
  })(req, res, next);
};

export const getCurrentUser = (req, res) => {
  return res.status(200).json({ user: toPublicUser(req.user) });
};
