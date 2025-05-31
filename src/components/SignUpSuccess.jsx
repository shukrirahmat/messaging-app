import { Link } from "react-router-dom";
import styles from "../styles/SignUpSuccess.module.css";

const SignUpSuccess = () => {
    return (
        <div className={styles.base} >
            <p>Sign up successful. Go to <Link to="/log-in">Login</Link> page</p>
        </div>
    )
}

export default SignUpSuccess;