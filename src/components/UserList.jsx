import { useState, useEffect } from "react";
import fetchURL from "../fetchURL.js";
import { differenceInMinutes } from "date-fns";
import PropTypes from "prop-types";
import styles from "../styles/UserList.module.css";

const UserList = ({ handleMessaging, handleCheckingProfile }) => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userList, setUserList] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const OFFLINE_TIME_OFF = 30;

  useEffect(() => {
    setIsLoadingUser(true);
    setFetchError(null);
    const token = window.localStorage.getItem("token");

    fetch(fetchURL + "/user/list", {
      mode: "cors",
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Failed to fetch users");
      })
      .then((data) => {
        setUserList(data);
        setIsLoadingUser(false);
      })
      .catch((err) => {
        setFetchError(err.message);
        setIsLoadingUser(false);
      });
  }, []);

  if (fetchError) {
    return <div className={styles.base}><p className={styles.message}>{fetchError}</p></div>;
  }

  if (isLoadingUser) {
    return (
      <div className={styles.base}>
        <p className={styles.message}>Loading users...</p>
      </div>
    );
  }

  if (userList.length < 1) {
    return (
      <div className={styles.base}>
        <p className={styles.message}>No users found</p>
      </div>
    );
  }

  return (
    <div className={styles.base}>
      <h2>USERS</h2>
      <div className={styles.list}>
        {userList
          .sort((user1, user2) => {
            let status1, status2;
            if (
              !user1.isLoggedIn ||
              differenceInMinutes(new Date(), user1.lastVerified) >
                OFFLINE_TIME_OFF
            ) {
              status1 = 1;
            } else {
              status1 = 0;
            }
            if (
              !user2.isLoggedIn ||
              differenceInMinutes(new Date(), user2.lastVerified) >
                OFFLINE_TIME_OFF
            ) {
              status2 = 1;
            } else {
              status2 = 0;
            }
            return status1 - status2;
          })
          .map((user) => {
            const idleTime = differenceInMinutes(new Date(), user.lastVerified);
            const isOnline = !user.isLoggedIn || idleTime > OFFLINE_TIME_OFF ? false : true;
            return (
              <div key={user.username} className={styles.user}>
                <p className={styles.userName}>{user.username}</p>
                <p className={isOnline? styles.userOnline : styles.userOffline}>
                  {isOnline
                    ? "ONLINE"
                    : "OFFLINE"}
                </p>
                <div className={styles.userBtnBox}>
                <button className={styles.userBtn}
                  onClick={() => {
                    handleMessaging(user.username);
                  }}
                >
                  MESSAGE
                </button>
                <button className={styles.userBtn}
                  onClick={() => {
                    handleCheckingProfile(user.username);
                  }}
                >
                  PROFILE
                </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

UserList.propTypes = {
  handleMessaging: PropTypes.func,
  handleCheckingProfile: PropTypes.func
};

export default UserList;
