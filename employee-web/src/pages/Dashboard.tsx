import { useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => {
    return {
      user: state.auth.user,
      token: state.auth.token,
    };
  });

  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user]);

  if (!user) return null;

  return <>Dashboard</>;
};

export default Dashboard;
