import { Link, NavLink, useNavigate } from "react-router-dom";

import styles from "./index.module.css";
import ThemeToggle from "../ThemeToggle";
import useAuth from "../../helpers/hooks/useAuth";
import { routerPaths } from "../../helpers/constants/routes";

const linkClassName = ({ isActive }) =>
  isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

const Navigation = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate(routerPaths.login);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to={routerPaths.schools} className={styles.brand}>
          Graduate Track
        </Link>
        <div className={styles.links}>
          {isAuthenticated ? (
            <>
              <NavLink to={routerPaths.schools} className={linkClassName} end>
                Browse Programs
              </NavLink>
              <NavLink to={routerPaths.applications} className={linkClassName}>
                My Applications
              </NavLink>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to={routerPaths.login} className={linkClassName}>
                Login
              </NavLink>
              <NavLink to={routerPaths.signup} className={linkClassName}>
                Signup
              </NavLink>
            </>
          )}
          {/* Outside the auth branches: the theme choice belongs to the visitor,
              not the session, so it stays available on Login and Signup too. */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
