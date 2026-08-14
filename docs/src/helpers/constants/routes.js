export const routerPaths = {
  login: "/login",
  signup: "/signup",
  // Same path as `schools`, deliberately named twice: "/" is the landing page for
  // visitors and the catalog for signed-in users, so callers can say which they mean.
  home: "/",
  schools: "/",
  school: "/:programId",
  applications: "/applications",
  applicationEdit: "/applications/:applicationId/edit",
};
