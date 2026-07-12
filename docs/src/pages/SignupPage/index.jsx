import { Link } from "react-router-dom";

import styles from "./index.module.css";

import { routerPaths } from "../../helpers/constants/routes";

const SignupPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>GraduateTrack</h1>
        <form onSubmit={() => {}} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" className={styles.input} />
          </div>
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
            Signup
          </button>
        </form>
        <Link to={routerPaths.login} className={styles.signup}>
          Already signuped?
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
