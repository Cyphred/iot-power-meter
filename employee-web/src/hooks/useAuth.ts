import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../redux/auth";
import { useAppDispatch } from "../redux/hooks";
import Employee from "../types/Employee";

export default () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const getAuthFromLocalStorage = () => {
    try {
      const usertoken = localStorage.getItem("userToken");
      const employee = localStorage.getItem("user");

      if (!employee) throw new Error();
      const parsedEmployee = JSON.parse(employee) as Employee;

      dispatch(setToken(usertoken));
      dispatch(setUser(parsedEmployee));

      return { usertoken, parsedEmployee };
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  return { getAuthFromLocalStorage };
};
