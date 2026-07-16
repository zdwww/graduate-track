import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./index.module.css";

import { routerPaths } from "../../helpers/constants/routes";
import useAuth from "../../helpers/hooks/useAuth";

// fetch/network rejections surface as these; show a friendly line instead.
const TECHNICAL_MESSAGES = ["Request failed", "Failed to fetch", "Load failed"];

const toMessage = (err) => {
  const message = err?.message;
  if (!message || TECHNICAL_MESSAGES.includes(message)) {
    return "Something went wrong. Please try again.";
  }
  return message;
};

const SignupPage = () => {
  const { signup, handleSignupInfoChange } = useAuth();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    if (error) {
      setError(null);
    }
    handleSignupInfoChange(field)(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setSubmitting(false);
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
              onChange={handleChange("name")}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="email" className={styles.formMargin}>
              Email:{" "}
            </label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              onChange={handleChange("email")}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="password" className={styles.formMargin}>
              Password:{" "}
            </label>
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              onChange={handleChange("password")}
            />
          </div>
          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? "Signing up..." : "Signup"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <Link to={routerPaths.login} className={styles.signup}>
          Already signuped?
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
