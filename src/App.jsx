import styles from "./App.module.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import fetchURL from "./fetchURL.js";

function App() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [isMessaging, setIsMessaging] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(null);

  const handleMessaging = (username) => {
    setIsMessaging(username);
    setIsCheckingProfile(null);
  };

  const handleCheckingProfile = (username) => {
    setIsCheckingProfile(username);
    setIsMessaging(null);
  };

  const handleLogOut = () => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      navigate(0);
    } else {
      fetch(fetchURL + "/user/log-out", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          username: user.username,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to log off properly");
          }
          return res.json();
        })
        .then((data) => {
          window.localStorage.removeItem("token");
          navigate(0);
        })
        .catch((err) => {
          window.localStorage.removeItem("token");
          navigate(0);
        });
    }
  };

  const goToProfile = () => {
    setIsMessaging(null);
    setIsCheckingProfile(null);
  };

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
          setIsLoggedIn(false);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className={styles.base}>
      <h1 className={styles.header}>
        <div className={styles.headerButtons}></div>
        <Link to="/">ODIN TEXT</Link>
        <div className={styles.headerButtons}>
          {isLoggedIn && <button onClick={goToProfile}>PROFILE</button>}
          {isLoggedIn && <button onClick={handleLogOut}>LOG OUT</button>}
        </div>
      </h1>
      {isLoading ? (
        <p className={styles.loadingMessage}>Loading...</p>
      ) : (
        <Outlet
          context={{
            isLoggedIn,
            user,
            isMessaging,
            isCheckingProfile,
            handleMessaging,
            handleCheckingProfile,
          }}
        />
      )}
      <p className={styles.footer}>© shkrrhmt 2025</p>
    </div>
  );
}

export default App;
