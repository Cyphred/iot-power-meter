import { Button, Card, Flex, Table } from "antd";
import { useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import useSubscribers, {
  IConsumerListResponseItem,
} from "../hooks/useSubscribers";
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
      <SubscriberTable />
    </Flex>
  );
};

const SubscriberTable = () => {
  const { getSubscribers, isLoading } = useSubscribers();
  const [subscribers, setSubscribers] = useState(
    [] as IConsumerListResponseItem[]
  );

  const handleGetSubscribers = async () => {
    const result = await getSubscribers();
    if (result) setSubscribers(result);
  };

  const handleReloadSubscribers = () => {
    handleGetSubscribers();
  };

  useEffect(() => {
    handleGetSubscribers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Meter ID",
      dataIndex: "meter",
      key: "meter",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  return (
    <>
      <Flex vertical gap={16}>
        <Flex style={{ width: "100%" }} justify="space-between" align="center">
          <Button type="default" onClick={handleReloadSubscribers}>
            Reload
          </Button>
        </Flex>
        <Table columns={columns} bordered />
      </Flex>
    </>
  );
};

export default Subscribers;
