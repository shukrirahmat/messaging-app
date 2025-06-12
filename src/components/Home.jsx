import { useOutletContext, Navigate} from "react-router-dom";
import { useState } from "react";
import UserList from "./UserList.jsx";
import MessagePanel from "./MessagePanel.jsx";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { isLoggedIn, user } = useOutletContext();
  const [isMessaging, setIsMessaging] = useState("");

  const handleMessaging = (username) => {
    setIsMessaging(username);
  };

  if (!isLoggedIn) {
    return <Navigate to="/log-in" />;
  }

  return (
    <div className={styles.base}>
        <UserList handleMessaging={handleMessaging} />
      <div className={styles.mainContent}>
        {isMessaging && <MessagePanel sender={user.username} receiver={isMessaging} />}
      </div>
    </div>
  );
};

export default Home;
