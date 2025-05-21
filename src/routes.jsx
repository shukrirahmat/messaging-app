import App from "./App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LoginForm /> },
      { path: "sign-up", element: <SignUpForm /> },
    ],
  },
];

export default routes;
