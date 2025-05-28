import { element } from "prop-types";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "sign-up", element: <SignUpForm /> },
      { path: "log-in", element: <LoginForm/>}
    ],
  },
];

export default routes;
