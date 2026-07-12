import { Link } from "react-router-dom";

import styles from "./index.module.css";

import { routerPaths } from "../../helpers/constants/routes";
import useAuth from "../../helpers/hooks/useAuth";

const SignupPage = () => {
  const { signup, handleSignupInfoChange } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>GraduateTrack</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="name">Name: </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              onChange={handleSignupInfoChange("name")}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="email" className={styles.formMargin}>
              Email:{" "}
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              onChange={handleSignupInfoChange("email")}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="password" className={styles.formMargin}>
              Password:{" "}
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              onChange={handleSignupInfoChange("password")}
            />
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
