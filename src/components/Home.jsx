import { useOutletContext, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchURL from "../fetchURL.js";
import UserList from "./UserList.jsx";
import MessagePanel from "./MessagePanel.jsx";
import styles from "../styles/Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useOutletContext();
  const [isMessaging, setIsMessaging] = useState(null);

  const handleMessaging = (username) => {
    setIsMessaging(username);
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

  if (!isLoggedIn) {
    return <Navigate to="/log-in" />;
  }

  return (
    <div className={styles.base}>
      <div className={styles.leftPanel}>
        <div className={styles.userActions}>
          <div className={styles.userName}>{user.username}</div>
          <nav className={styles.userNavs}>
          <button >Profile</button>
          <button >Inbox</button>
          <button onClick={handleLogOut}>Logout</button>
          </nav>
        </div>
        <UserList currentUser={user} handleMessaging={handleMessaging} />
      </div>
      <div className={styles.mainContent}>
        {isMessaging && <MessagePanel receiver={isMessaging} />}
      </div>
    </div>
  );
};

export default Home;
