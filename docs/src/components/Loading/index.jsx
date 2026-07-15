import styles from "./index.module.css";
const Loading = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.status}>Loading...</p>
    </div>
  );
};

export default Loading;
