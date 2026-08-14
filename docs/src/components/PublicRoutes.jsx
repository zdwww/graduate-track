import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { routerPaths } from "../helpers/constants/routes";
import useAuth from "../helpers/hooks/useAuth";

const PublicRoute = ({ component }) => {
  const { isAuthenticated, loading } = useAuth();

  // While the stored token is being checked against the server, isAuthenticated is
  // still false even though the visitor is signed in. Deciding now would show a
  // signed-in user the login form until /auth/me answers, which on a cold backend
  // is long enough for them to start typing. PrivateRoute already waits like this.
  if (loading) {
    return null;
  }

  // replace, so signing in does not leave /login in history for the back button.
  return isAuthenticated ? (
    <Navigate to={routerPaths.schools} replace />
  ) : (
    component
  );
};

PublicRoute.propTypes = {
  component: PropTypes.element.isRequired,
};

export default PublicRoute;
