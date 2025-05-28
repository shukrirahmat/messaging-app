import { useState } from "react";
import { Link, replace } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import fetchURL from "../fetchURL.js";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [logInErr, setLogInErr] = useState("");


  const editUsername = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);
  };

  const editPassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setLogInErr("");

    if (username.length < 1 || password.length < 1) {
      setLogInErr("Both field must be filled");
    } else {
      setIsLogging(true);
      fetch(fetchURL + "/user/log-in", {
        mode: "cors",
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to log in, Server error.");
          }
          return res.json();
        })
        .then((data) => {
          if (!data.success) {
            setIsLogging(false);
            setLogInErr(data.message)
          } else {
            setIsLogging(false);
            window.localStorage.setItem("token", data.token);
            navigate("/");
            navigate(0);
          }
        })
        .catch((err) => {
          setIsLogging(false);
          setLogInErr(err.message);
        });
    }
  };

  return (
    <div className={styles.base}>
      <form className={styles.form} onSubmit={handleSubmitForm}>
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
        <div className={styles.buttonDiv}>
          <button className={styles.loginBtn} disabled={isLogging}>
            {isLogging ? "LOGGING IN..." : "LOG IN"}
          </button>
          {logInErr && <p className={styles.logInErr}>{logInErr}</p>}
        </div>
        <p className={styles.signUpText}>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
