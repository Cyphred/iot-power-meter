import { Button, Flex, Table, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSubscribers, {
  IConsumerListResponseItem,
} from "../hooks/useSubscribers";
import useBilling from "../hooks/useBilling";
import useReports from "../hooks/useReports";
dayjs.extend(relativeTime);

const Subscribers = () => {
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
  const { isLoading: isBillsLoading, generateBills } = useBilling();
  const { resetEverything } = useReports();

  const handleGetSubscribers = async () => {
    const result = await getSubscribers();
    if (result) setSubscribers(result);
  };

  const handleReloadSubscribers = () => {
    handleGetSubscribers();
  };

  const onGenerateBilling = async () => {
    const result = await generateBills();
    if (!result) return;
    alert("Successfully generated billing");
  };

  const handleResetData = async () => {
    await resetEverything();
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
  ];
  return (
    <>
      <Flex vertical gap={16}>
        <Flex style={{ width: "100%" }} justify="space-between" align="center">
          <Button type="default" onClick={handleReloadSubscribers}>
            Reload
          </Button>

          <Button danger type="default" onClick={handleResetData}>
            Reset All Data
          </Button>

          <Button onClick={onGenerateBilling} type="primary">
            Generate Billing
          </Button>
        </Flex>
        <Table
          columns={columns}
          bordered
          dataSource={subscribers.map((subscriber) => {
            return {
              key: subscriber.consumer._id,
              name: (
                <Link
                  to={`/subscribers/${subscriber.consumer._id}`}
                  target="_blank"
                >
                  <Typography.Link>
                    {subscriber.consumer.lastName},{" "}
                    {subscriber.consumer.firstName}
                    {subscriber.consumer.middleName ?? ""}
                  </Typography.Link>
                </Link>
              ),
              meter: subscriber.meter?._id ?? (
                <Typography.Text type="secondary">No meter</Typography.Text>
              ),
              address: `${subscriber.consumer.streetAddress}, ${subscriber.consumer.barangay}, ${subscriber.consumer.city}`,
            };
          })}
        />
      </Flex>
    </>
  );
};

export default Subscribers;
