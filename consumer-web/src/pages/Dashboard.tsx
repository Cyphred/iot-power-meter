import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { Descriptions } from "antd";

const Dashboard = () => {
  const { token, user, stats } = useAppSelector((state) => {
    return {
      token: state.auth.token,
      user: state.auth.user,
      stats: state.stats,
    };
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user]);

  return (
    <Descriptions title="Stats" layout="vertical" style={{ padding: 16 }}>
      <Descriptions.Item label="Average Load">
        {stats.averageLoad.toFixed(4)} KWH
      </Descriptions.Item>

      <Descriptions.Item label="Current Load">
        {stats.currentLoad.toFixed(4)} KWH
      </Descriptions.Item>

      <Descriptions.Item label="This month's consumption">
        {stats.currentConsumption.toFixed(4)} KWH
      </Descriptions.Item>

      <Descriptions.Item label="Current bill">
        Php. {stats.estimatedBill.toFixed(2)} @ Php.{" "}
        {stats.estimatedRate.toFixed(2)}/KWH
      </Descriptions.Item>
    </Descriptions>
  );
};

export default Dashboard;
