import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/ProfilePage.module.css";
import fetchURL from "../fetchURL.js";

const ProfilePage = ({ currentUser, username, handleCheckingProfile }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editInputs, setEditInputs] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleEditing = () => {
    setIsEditing(true);
  };

  const handleInputChange = (newInputs) => {
    setEditInputs(newInputs);
  };

  const cancelEdit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setEditInputs({ ...profile });
    setUpdateError(null);
    setIsUpdating(false);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    const token = window.localStorage.getItem("token");

    fetch(fetchURL + "/user/profile", {
      mode: "cors",
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: editInputs.username,
        fullName: editInputs.fullName,
        bio: editInputs.bio,
        gender: editInputs.gender,
        location: editInputs.location,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else if (response.status == 401) throw new Error("Unverified");
        else throw new Error("Failed to update profile");
      })
      .then((data) => {
        setProfile(data);
        setEditInputs({ ...data });
        setIsUpdating(false);
        setIsEditing(false);
      })
      .catch((err) => {
        if (err.message == "Unverified") {
          navigate(0);
        } else {
          setUpdateError(err.message);
          setIsUpdating(false);
        }
      });
  };

  useEffect(() => {  
    setIsLoadingProfile(true);
    setFetchError(null);
    setUpdateError(null);
    setIsUpdating(false);
    setIsEditing(false);
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
        setEditInputs({ ...data });
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
      ) : isEditing ? (
        <form className={styles.editForm} onSubmit={saveEdit}>
          <p className={styles.username}>{profile.username}</p>
          <textarea
            name="bio"
            placeholder={`Write your bio...`}
            value={editInputs.bio? editInputs.bio : ""}
            onChange={(e) => {
              handleInputChange({ ...editInputs, bio: e.target.value });
            }}
          ></textarea>

          <div className={styles.inputBox}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={editInputs.fullName? editInputs.fullName : ""}
              onChange={(e) => {
                handleInputChange({ ...editInputs, fullName: e.target.value });
              }}
            />
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="gender">Gender</label>
            <select name="gender" id="gender" defaultValue={editInputs.gender? editInputs.gender : ""} onChange={(e) => {
                handleInputChange({ ...editInputs, gender: e.target.value });
              }}>
              <option value="Male" >Male</option>
              <option value="Female" >Female</option>
              <option value="">Do Not Show</option>
            </select>
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={editInputs.location? editInputs.location : ""}
              onChange={(e) => {
                handleInputChange({ ...editInputs, location: e.target.value });
              }}
            />
          </div>

          {isUpdating && <p>Saving profile...</p>}
          {updateError && <p>{updateError}</p>}
          {currentUser.username === profile.username && !isUpdating && (
            <div>
              <button className={styles.editBtn} type="submit">
                SAVE
              </button>
              <button className={styles.editBtn} onClick={cancelEdit}>
                CANCEL
              </button>
            </div>
          )}
        </form>
      ) : (
        <div className={styles.profileContainer}>
          <p className={styles.username}>{profile.username}</p>
          {profile.bio ? (
            <p className={styles.bio}>{profile.bio} </p>
          ) : (
            <p className={styles.emptyBio}>
              {currentUser.username === profile.username
                ? "You have not written your bio"
                : "This user has not shared their bio yet"}
            </p>
          )}
          {profile.fullName && (
            <div className={styles.otherDetails}>
              <b>Full Name</b>
              <p>{profile.fullName} </p>
            </div>
          )}
          {profile.gender && (
            <div className={styles.otherDetails}>
              <b>Gender</b>
              <p>{profile.gender} </p>
            </div>
          )}
          {profile.location && (
            <div className={styles.otherDetails}>
              <b>Location</b>
              <p>{profile.location} </p>
            </div>
          )}

          {currentUser.username === profile.username && (
            <button className={styles.editBtn} onClick={handleEditing}>
              EDIT PROFILE
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  currentUser: PropTypes.object,
  username: PropTypes.string,
  handleCheckingProfile: PropTypes.func
};

export default ProfilePage;
