import { setToken, setUser } from "../redux/auth";
import { useAppDispatch } from "../redux/hooks";
import Employee from "../types/Employee";

export default () => {
  const dispatch = useAppDispatch();
  const getAuthFromLocalStorage = () => {
    try {
      const usertoken = localStorage.getItem("userToken");
      const employee = localStorage.getItem("user");

      if (!employee || !usertoken) return;

      const parsedEmployee = JSON.parse(employee) as Employee;

      dispatch(setToken(usertoken));
      dispatch(setUser(parsedEmployee));

      return { usertoken, parsedEmployee };
    } catch (err) {
      console.error(err);
    }
  };

  return { getAuthFromLocalStorage };
};
