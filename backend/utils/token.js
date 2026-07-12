import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set; using an insecure development default. Set JWT_SECRET in production.",
  );
}

export function signToken(user) {
  return jwt.sign({ email: user.email }, JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: JWT_EXPIRES_IN,
  });
}

export { JWT_SECRET };
