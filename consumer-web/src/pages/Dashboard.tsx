import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Flex, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useReports from "../hooks/useReports";
import BreakdownTable from "../components/BreakdownTable";
import useBilling from "../hooks/useBilling";
import IBilling from "../types/Billing";
dayjs.extend(relativeTime);

const Dashboard = () => {
  const { token, user, consumption, meter, rate } = useAppSelector((state) => {
    return {
      token: state.auth.token,
      user: state.auth.user,
      meter: state.meter.meter,
      consumption: state.stats.consumption?.consumption,
      rate: state.stats.consumption?.ratePerKwh,
    };
  });
  const { getPendingBill } = useBilling();
  const navigate = useNavigate();
  const { getConsumptionReport, isLoading } = useReports();
  const [lastPulledStats, setLastPulledStats]: [
    Date | undefined,
    React.Dispatch<React.SetStateAction<Date | undefined>>
  ] = useState();

  const [bill, setBill]: [
    IBilling | undefined,
    React.Dispatch<React.SetStateAction<IBilling | undefined>>
  ] = useState();

  const handleGetConsumptionReport = async () => {
    const result = await getConsumptionReport();
    if (result) setLastPulledStats(new Date());
  };

  const handleGetPendingBill = async () => {
    if (!user) return;

    const bill = await getPendingBill(user._id);
    if (!bill) return;
    setBill(bill.bill ?? undefined);
  };

  useEffect(() => {
    handleGetConsumptionReport();
    handleGetPendingBill();
  }, []);

  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user]);

  const handleReloadStats = () => {
    handleGetConsumptionReport();
    handleGetPendingBill();
  };

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
    <>
      <Descriptions
        title={
          <Flex
            style={{ width: "100%" }}
            gap={8}
            align="center"
            justify="space-between"
          >
            <>Stats</>

            <Flex align="center" gap={8}>
              <Typography.Text
                type="secondary"
                style={{ fontWeight: "normal" }}
              >
                Last reloaded{" "}
                {!lastPulledStats ? (
                  "never"
                ) : (
                  <>
                    {dayjs(lastPulledStats).format("hh:mm:ss A MMM DD, YYYY")}
                    <br />({dayjs(lastPulledStats).fromNow()})
                  </>
                )}
              </Typography.Text>
              <Button
                type="default"
                onClick={handleReloadStats}
                disabled={isLoading}
              >
                Reload
              </Button>
            </Flex>
          </Flex>
        }
        layout="vertical"
        style={{ padding: 16 }}
      >
        <Descriptions.Item label="Meter Last Seen">
          {dayjs(meter.lastSeen).format("hh:mm A MMM DD, YYYY")}
          <Typography.Text type="secondary">
            ({dayjs(meter.lastSeen).fromNow()})
          </Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label="Average Daily Load">
          {consumption ? (
            <>{consumption.averageDaily.toFixed(2)} KWH</>
          ) : (
            <>No data</>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Current Load">
          {consumption && consumption.rightNow ? (
            dayjs(new Date()).diff(consumption.rightNow.timestamp, "seconds") >=
            30 ? (
              <>No data - meter has been offline for too long.</>
            ) : (
              <>{consumption.rightNow.value.toFixed(2)} A</>
            )
          ) : (
            <>No data</>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="This month's consumption">
          {consumption ? (
            <> {consumption.sinceCutoff.toFixed(2)} KWH </>
          ) : (
            <>No data</>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Current bill">
          {rate && consumption ? (
            <>
              Php. {(consumption.sinceCutoff * rate).toFixed(2)} @ Php.{" "}
              {rate.toFixed(2)}
              /KWH
            </>
          ) : (
            <>No data</>
          )}
        </Descriptions.Item>
      </Descriptions>

      {bill ? (
        <Flex gap={8} vertical style={{ padding: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Pending Bill
          </Typography.Title>

          <Typography.Text>
            Cutoff: {dayjs(bill.end).format("MMM DD, YYYY")}
          </Typography.Text>

          <Typography.Text>
            Due date: {dayjs(bill.dueDate).format("MMM DD, YYYY")}
          </Typography.Text>

          <Typography.Text>
            Disconnection:{" "}
            {dayjs(bill.disconnectionDate).format("MMM DD, YYYY")}
          </Typography.Text>

          <BreakdownTable
            rateBreakdown={bill.breakdown}
            ratePerKwh={bill.rate}
            kwhSinceCutoff={bill.consumption}
          />
        </Flex>
      ) : (
        "No pending bill"
      )}
    </>
  );
};

export default Dashboard;
