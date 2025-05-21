import { useState } from "react";
import styles from "../styles/SignUpForm.module.css";

const signUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameErr, setUsernameErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [passwordErr2, setPasswordErr2] = useState(null);

  const isFirstCharALetter = (string) => {
    return isNaN(string.charAt(0)) && string.charAt(0) !== "_";
  };

  const editUsername = (e) => {
    const newname = e.target.value;
    setUsername(newname);
    if (newname.length > 0 && !newname.match("^[a-zA-Z0-9_]+$")) {
      setUsernameErr("*Only letters, numbers and underscores are allowed");
    } else if (newname.length > 0 && !isFirstCharALetter(newname)) {
      setUsernameErr("*First character should be a letter");
    } else {
      setUsernameErr("");
    }
  };

  const editPassword = (e) => {
    const newpassword = e.target.value;
    setPassword(newpassword);
    if (password2.length > 0 && newpassword !== password2) {
      setPasswordErr2("*Password did not match");
    } else if (newpassword.length > 0 && newpassword.length < 6) {
      setPasswordErr("*Password should have 6 characters minimum");
    } else {
      setPasswordErr("");
      setPasswordErr2("")
    }
  };

  const editPassword2 = (e) => {
    const newpassword2 = e.target.value;
    setPassword2(newpassword2);
    if (newpassword2.length > 0 && newpassword2 !== password) {
      setPasswordErr2("*Password did not match");
    } else {
      setPasswordErr2("");
    }
  };

  return (
    <div className={styles.base}>
      <form className={styles.form}>
        <div>
            <label htmlFor="username">USERNAME</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Letters, numbers and underscores"
            value={username}
            onChange={editUsername}
          />
          {usernameErr && <p className={styles.errorMsg}>{usernameErr}</p>}
        </div>
        <div>
            <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="6 characters minimum"
            value={password}
            onChange={editPassword}
          />
          {passwordErr && <p className={styles.errorMsg}>{passwordErr}</p>}
        </div>
        <div>
            <label htmlFor="password2">CONFIRM PASSWORD</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={editPassword2}
          />
          {passwordErr2 && <p className={styles.errorMsg}>{passwordErr2}</p>}
        </div>
        <button className={styles.signUpBtn}>SIGN UP</button>
      </form>
    </div>
  );
};

export default signUpForm;
