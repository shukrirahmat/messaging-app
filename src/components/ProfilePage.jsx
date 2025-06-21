import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
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
        else throw new Error("Failed to fetch users");
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
  }, []);

  return <p>This is profile page</p>;
};

export default ProfilePage;
