import PropTypes from "prop-types";

import styles from "./index.module.css";

const ErrorMessage = ({ error }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.error}>{error}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorMessage;
