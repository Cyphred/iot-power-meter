import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { Card, Descriptions, Flex, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Dashboard = () => {
  const { token, user, stats, meter } = useAppSelector((state) => {
    return {
      token: state.auth.token,
      user: state.auth.user,
      meter: state.meter.meter,
      stats: state.stats,
    };
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user]);

  if (!user) return null;

  if (!meter) {
    return (
      <Flex
        vertical
        style={{ width: "100%", height: "100%" }}
        justify="center"
        align="center"
      >
        <Card style={{ maxWidth: 400 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            No Registered Meter
          </Typography.Title>
          <Typography.Text>
            It seems like you currently do not have a meter assigned to you.
            Contact our customer service hotlines if you think this is an error.
          </Typography.Text>
        </Card>
      </Flex>
    );
  }

  return (
    <Descriptions title="Stats" layout="vertical" style={{ padding: 16 }}>
      <Descriptions.Item label="Meter Last Seen">
        {dayjs(meter.lastSeen).format("hh:mm A MMM DD, YYYY")}
        <Typography.Text type="secondary">
          ({dayjs(meter.lastSeen).fromNow()})
        </Typography.Text>
      </Descriptions.Item>

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
