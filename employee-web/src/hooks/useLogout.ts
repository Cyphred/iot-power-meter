import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  function resetLocalAuth() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
  }

  function logout() {
    resetLocalAuth();
    navigate("/login");
  }

  return { resetLocalAuth, logout };
}
