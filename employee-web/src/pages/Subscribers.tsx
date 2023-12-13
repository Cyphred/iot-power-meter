import { Button, Card, Flex } from "antd";
import { useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const Subscribers = () => {
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

  return (
    <Flex vertical style={{ padding: 16 }}>
      <Card title="Actions">
        <Flex gap={8} style={{ width: "100%" }} align="center" justify="center">
          <Button type="default">Manage Subscribers</Button>
          <Button type="default">Manage Meters</Button>
          <Button type="default">Manage Cutoff</Button>
          <Button type="default">Manage Rates</Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Subscribers;
