import { Navigate } from "react-router";
import PropTypes from "prop-types";

import { routerPaths } from "../helpers/constants/routes";
import useAuth from "../helpers/hooks/useAuth";

const PrivateRoute = ({ component }) => {
  const { isAuthenticated, loading } = useAuth();
  // 認証状態の確認中は何も表示しない
  if (loading) {
    return null;
  }
  if (isAuthenticated) {
    return component;
  } else {
    // Home, not the login form. Signing out re-renders the page you were on before
    // the logout handler's own navigate lands, so this redirect is what actually
    // decides where you end up — and it should agree with it. It also means a
    // stranger following a deep link gets the page that explains the app.
    return <Navigate to={routerPaths.home} replace />;
  }
};

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
};

export default PrivateRoute;
