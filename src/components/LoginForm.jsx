import { useState } from "react";
import styles from "../styles/LoginForm.module.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const editUsername = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);
  }

  const editPassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
  }

  return (
    <div className={styles.base}>
      <form className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={editUsername}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={editPassword}
        />
        <button className={styles.loginBtn}>LOG-IN</button>
        <p className={styles.signUpText}>Don't have an account? <a href="/">Sign up</a></p>
      </form>
    </div>
  );
};

export default LoginForm;
