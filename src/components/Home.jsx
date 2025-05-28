import { useOutletContext, Navigate } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user } = useOutletContext();

  if (!isLoggedIn) {
    return <Navigate to="/log-in" />;
  }

  return (
    <div>
      <h1>THIS IS HOME PAGE</h1>
      <p>Logged in as {user.username}</p>
    </div>
  );
};

export default Home;
