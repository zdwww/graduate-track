import passport from "../config/passport.js";

export const requireAuth = passport.authenticate("jwt", { session: false });
