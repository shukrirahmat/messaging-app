import { useOutletContext, Navigate } from "react-router-dom";
import { useState } from "react";
import UserList from "./UserList.jsx";
import MessagePanel from "./MessagePanel.jsx";
import styles from "../styles/Home.module.css";
import ProfilePage from "./ProfilePage.jsx";

const Home = () => {
  const {
    isLoggedIn,
    user,
    isMessaging,
    isCheckingProfile,
    handleMessaging,
    handleCheckingProfile,
  } = useOutletContext();

  if (!isLoggedIn) {
    return <Navigate to="/log-in" />;
  }

  return (
    <div className={styles.base}>
      <UserList
        handleMessaging={handleMessaging}
        handleCheckingProfile={handleCheckingProfile}
      />
      <div className={styles.mainContent}>
        {isMessaging ? (
          <MessagePanel sender={user.username} receiver={isMessaging} />
        ) : isCheckingProfile ? (
          <ProfilePage currentUser={user} username={isCheckingProfile} />
        ) : (
          <ProfilePage currentUser={user} username={user.username} />
        )}
      </div>
    </div>
  );
};

export default Home;
