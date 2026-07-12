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
    return <Navigate to={routerPaths.login} />;
  }
};

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
};

export default PrivateRoute;
