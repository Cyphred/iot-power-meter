import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../src/redux/auth";
import { useAppDispatch } from "../src/redux/hooks";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function resetLocalAuth() {
    localStorage.removeItem("user");
    dispatch(setToken(null));
    dispatch(setUser(null));
  }

  function logout() {
    resetLocalAuth();
    navigate("/login");
  }

  return { resetLocalAuth, logout };
}
