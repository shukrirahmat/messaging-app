import styles from "./App.module.css";
import { Outlet, Link} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import fetchURL from "./fetchURL.js";

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsLoading(true);

    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
    } else {
      fetch(fetchURL + "/user", {
        mode: "cors",
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error("Server error");
        })
        .then((data) => {
          setUser(data);
          setIsLoggedIn(true);
          setIsLoading(false);
        })
        .catch((err) => {
          window.localStorage.removeItem("token");
          setIsLoggedIn(false)
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className={styles.base}>
      <h1 className={styles.header}>
        <Link to="/">ODIN TEXT</Link>
      </h1>
      {isLoading? (<p className={styles.loadingMessage}>Loading...</p>) : <Outlet context={{isLoggedIn, user}}/>}
      <p className={styles.footer}>© shkrrhmt 2025</p>
    </div>
  );
}

export default App;
