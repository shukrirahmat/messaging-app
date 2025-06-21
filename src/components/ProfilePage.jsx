import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/ProfilePage.module.css";
import fetchURL from "../fetchURL.js";

const ProfilePage = ({ currentUser, username}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setIsLoadingProfile(true);
    setFetchError(null);
    const token = window.localStorage.getItem("token");

    fetch(fetchURL + "/user/profile", {
      mode: "cors",
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else if (response.status == 401) throw new Error("Unverified");
        else throw new Error("Failed to fetch profile");
      })
      .then((data) => {
        setProfile(data);
        setIsLoadingProfile(false);
      })
      .catch((err) => {
        if (err.message == "Unverified") {
          navigate(0);
        } else {
          setFetchError(err.message);
          setIsLoadingProfile(false);
        }
      });
  }, [username]);

  return (
    <div className={styles.base}>
      {isLoadingProfile ? (
        <p>Loading profile...</p>
      ) : fetchError ? (
        <p>{fetchError}</p>
      ) : (
        <div>
            <p>{username}</p>
            {currentUser.username === profile.username && <button>EDIT PROFILE</button>}
            {(profile.firstName || profile.lastName) && <p>Name: {profile.firstName} {profile.lastName} </p>}
            {profile.age && <p>Age: {profile.age} </p>}
            {profile.gender && <p>Gender: {profile.gender} </p>}
            {profile.from && <p>From: {profile.from} </p>}
            {profile.bio && <p>Bio: {profile.bio} </p>}
        </div>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  currentUser: PropTypes.object,
  username: PropTypes.string,
};

export default ProfilePage;
