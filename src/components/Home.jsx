import { useOutletContext, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchURL from "../fetchURL.js";
import UserList from "./UserList.jsx";
import MessagePanel from "./MessagePanel.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useOutletContext();
  const [isMessaging, setIsMessaging] = useState(null);

  const handleMessaging = (username) => {
    setIsMessaging(username);
  }


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
    <div>
      <h1>THIS IS HOME PAGE</h1>
      <div>
      <p>Logged in as {user.username}</p>
      <button onClick={handleLogOut}>LOG OUT</button>
      <UserList currentUser={user} handleMessaging={handleMessaging}/>
      </div>
      <div>
        {isMessaging && <MessagePanel receiver={isMessaging}/>}
      </div>
    </div>
  );
};

export default Home;
