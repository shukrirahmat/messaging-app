import { useState, useEffect } from "react";
import fetchURL from "../fetchURL.js";
import { differenceInMinutes } from "date-fns";

const UserList = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userList, setUserList] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const OFFLINE_TIME_OFF = 3

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
    return <p>{fetchError}</p>;
  }

  if (isLoadingUser) {
    return <p>Loading users...</p>;
  }

  if (userList.length < 1) {
    return <p>No users found</p>;
  }

  return (
    <div>
      {userList.sort((user1, user2) => {
        let status1, status2;
        if (!user1.isLoggedIn || differenceInMinutes(new Date(), user1.lastVerified) > OFFLINE_TIME_OFF) {
            status1 = 1;
        } else {status1 = 0}
        if (!user2.isLoggedIn || differenceInMinutes(new Date(), user2.lastVerified) > OFFLINE_TIME_OFF) {
            status2 = 1;
        } else {status2 = 0}
        return status1 - status2;
      }).map((user) => {
        const idleTime = differenceInMinutes(new Date(), user.lastVerified);
        return (<div key={user.username}>
            <p>{user.username}</p>
            <p>status: {!user.isLoggedIn || idleTime > OFFLINE_TIME_OFF ? "Offline" : "Online"}</p>
        </div>)
      })}
    </div>
  );
};

export default UserList;
