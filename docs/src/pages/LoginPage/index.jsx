import { Link } from "react-router-dom";

import styles from "./index.module.css";

import { routerPaths } from "../../helpers/constants/routes";

const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>GraduateTrack</h1>
        <form onSubmit={() => {}} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="email">Email: </label>
            <input id="email" type="email" className={styles.input} />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="password" className={styles.password}>
              Password:{" "}
            </label>
            <input id="password" type="password" className={styles.input} />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <Link to={routerPaths.signup} className={styles.signup}>
          Haven't signuped yet?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
