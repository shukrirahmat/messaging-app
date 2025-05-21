import { Link } from "react-router-dom";
import styles from "../styles/ErrorPage.module.css";

const ErrorPage = () => {
    return (
        <div className={styles.base} >
            <p>Could not found the page. Return to <Link to="/">Home</Link></p>
        </div>
    )
}

export default ErrorPage;