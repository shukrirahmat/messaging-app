import { useOutletContext, Navigate, useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useOutletContext();

  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    navigate(0);
  };

  if (!isLoggedIn) {
    return <Navigate to="/log-in" />;
  }

  return (
    <div>
      <h1>THIS IS HOME PAGE</h1>
      <p>Logged in as {user.username}</p>
      <button onClick={handleLogOut}>LOG OUT</button>
    </div>
  );
};

export default Home;
