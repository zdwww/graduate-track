import PropTypes from "prop-types";

import useAuth from "../helpers/hooks/useAuth";

// "/" is the landing page for visitors and the catalog for signed-in users, so the
// live URL introduces the app instead of bouncing strangers to a login form.
const HomeRoute = ({ publicComponent, privateComponent }) => {
  const { isAuthenticated, loading } = useAuth();

  // Same guard as PrivateRoute: rendering during the auth check would flash the
  // landing page at a returning user before their session resolves.
  if (loading) {
    return null;
  }

  return isAuthenticated ? privateComponent : publicComponent;
};

HomeRoute.propTypes = {
  publicComponent: PropTypes.element.isRequired,
  privateComponent: PropTypes.element.isRequired,
};

export default HomeRoute;
