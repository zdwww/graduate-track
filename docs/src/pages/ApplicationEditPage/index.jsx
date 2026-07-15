import { Link, useParams } from "react-router-dom";

import styles from "./index.module.css";
import { routerPaths } from "../../helpers/constants/routes.js";

const ApplicationEditPage = () => {
  const { applicationId } = useParams();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link to={routerPaths.applications} className={styles.backLink}>
          ← Back to Applications
        </Link>
        <h1 className={styles.title}>Edit Application</h1>
        <p className={styles.status}>Application ID: {applicationId}</p>
      </div>
    </div>
  );
};

export default ApplicationEditPage;
