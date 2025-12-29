import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return (
      <Register
        goToLogin={() => setPage("login")}
        goToDashboard={() => setPage("dashboard")}
      />
    );
  }

  if (page === "reset") {
    return <ResetPassword goToLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return <Dashboard goToLogin={() => setPage("login")} />;
  }

  return (
    <Login
      goToRegister={() => setPage("register")}
      goToReset={() => setPage("reset")}
      goToDashboard={() => setPage("dashboard")}
    />
  );
}
