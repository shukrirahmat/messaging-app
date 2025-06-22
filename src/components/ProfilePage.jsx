import { useEffect, useState} from "react";
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
        <div className={styles.profileContainer}>
            <p className={styles.username}>{profile.username}</p>
            {profile.bio ? <p className={styles.bio}>{profile.bio} </p > : <p className={styles.emptyBio}>This user has not shared their bio yet</p>}
            {(profile.firstName || profile.lastName) && <div className={styles.otherDetails}><b>Full Name</b><p>{profile.firstName} {profile.lastName} </p></div>}
            {profile.age && <div className={styles.otherDetails}><b>Age</b><p>{profile.age} </p></div>}
            {profile.gender && <div className={styles.otherDetails}><b>Gender</b><p>{profile.gender} </p></div>}
            {profile.from && <div className={styles.otherDetails}><b>Location</b><p>{profile.from} </p></div>}
            
            {currentUser.username === profile.username && <button>EDIT PROFILE</button>}
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
