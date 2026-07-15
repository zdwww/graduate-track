import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { routerPaths } from "../helpers/constants/routes";
import useAuth from "../helpers/hooks/useAuth";

const PublicRoute = ({ component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={routerPaths.schools} /> : component;
};

PublicRoute.propTypes = {
  component: PropTypes.element.isRequired,
};

export default PublicRoute;
