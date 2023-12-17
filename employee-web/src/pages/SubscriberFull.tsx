import { useParams } from "react-router-dom";
import useSubscribers from "../hooks/useSubscribers";
import { useEffect, useState } from "react";
import IConsumer from "../types/Consumer";
import { Button, Descriptions, Flex, Switch, Typography } from "antd";
import IMeter from "../types/Meter";
import useReports from "../hooks/useReports";
import IConsumptionReport from "../types/ConsumptionReport";
import dayjs from "dayjs";
import BreakdownTable from "../components/BreakdownTable";
import useMeter from "../hooks/useMeter";

const SubscriberFull = () => {
  const { subscriberId } = useParams();
  const { getSubscriberById } = useSubscribers();
  const { getConsumptionReport } = useReports();
  const { switchMeter, isLoading: isMeterLoading } = useMeter();
  const [subscriber, setSubscriber]: [
    IConsumer | undefined,
    React.Dispatch<React.SetStateAction<IConsumer | undefined>>
  ] = useState();

  const [meter, setMeter]: [
    IMeter | undefined,
    React.Dispatch<React.SetStateAction<IMeter | undefined>>
  ] = useState();

  const [report, setReport]: [
    IConsumptionReport | undefined,
    React.Dispatch<React.SetStateAction<IConsumptionReport | undefined>>
  ] = useState();

  const handleGetSubscriber = async () => {
    if (!subscriberId) return;
    const response = await getSubscriberById(subscriberId);
    if (response && response.consumer) setSubscriber(response.consumer);
    if (response && response.meter) setMeter(response.meter);

    const response2 = await getConsumptionReport(subscriberId);
    if (response2) setReport(response2);
  };

  const handleMeterSwitched = async (state: boolean) => {
    if (!meter) return;
    const result = await switchMeter(meter?._id, state);
    if (result) {
      setMeter(result.meter);
    }
  };

  useEffect(() => {
    if (!subscriber) handleGetSubscriber();
  }, [subscriber]);

  if (!subscriber) return "No subscriber data";

  return (
    <Flex gap={16} style={{ padding: 16 }} vertical>
      <Descriptions
        title={
          <Flex align="center" gap={8}>
            <Button onClick={handleGetSubscriber}>Reload</Button>
            {subscriber.lastName}, {subscriber.firstName}
            {subscriber.middleName ?? ""}
          </Flex>
        }
      >
        <Descriptions.Item label="Status">
          <Flex align="center" gap={8}>
            {subscriber.active ? "ACTIVE" : "INACTIVE"}
          </Flex>
        </Descriptions.Item>

        <Descriptions.Item label="Address">
          {subscriber.streetAddress}, {subscriber.barangay}, {subscriber.city}
        </Descriptions.Item>

        <Descriptions.Item label="E-mail">{subscriber.email}</Descriptions.Item>

        <Descriptions.Item label="Meter">
          <Flex gap={8} align="center">
            {meter?._id ?? (
              <Typography.Text type="secondary">No meter</Typography.Text>
            )}

            {meter && (
              <Switch
                checked={meter?.active}
                onChange={(checked) => handleMeterSwitched(checked)}
                disabled={isMeterLoading}
              />
            )}
          </Flex>
        </Descriptions.Item>

        {!report ? (
          "No report data."
        ) : (
          <>
            <Descriptions.Item label="Meter Last Seen">
              {dayjs(report.meter.lastSeen).format("hh:mm A MMM DD, YYYY")}
              <Typography.Text type="secondary">
                ({dayjs(report.meter.lastSeen).fromNow()})
              </Typography.Text>
            </Descriptions.Item>

            <Descriptions.Item label="Average Daily Load">
              {report.consumption ? (
                <>{report.consumption.averageDaily.toFixed(4)} KWH</>
              ) : (
                <>No data</>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Current Load">
              {report.consumption !== undefined ? (
                dayjs(new Date()).diff(
                  report.consumption.rightNow.timestamp,
                  "seconds"
                ) >= 10 ? (
                  <>No data - meter has been offline for too long.</>
                ) : (
                  <>{report.consumption.rightNow.value.toFixed(4)} A</>
                )
              ) : (
                <>No data</>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="This month's consumption">
              {report.consumption ? (
                <> {report.consumption.sinceCutoff.toFixed(4)} KWH </>
              ) : (
                <>No data</>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Current bill">
              {report.ratePerKwh && report.consumption ? (
                <>
                  Php.{" "}
                  {(report.consumption.sinceCutoff * report.ratePerKwh).toFixed(
                    2
                  )}{" "}
                  @ Php. {report.ratePerKwh.toFixed(2)}
                  /KWH
                </>
              ) : (
                <>No data</>
              )}
            </Descriptions.Item>

            <BreakdownTable
              rateBreakdown={report.rateBreakdown}
              ratePerKwh={report.ratePerKwh}
              kwhSinceCutoff={report.consumption.sinceCutoff}
            />
          </>
        )}
      </Descriptions>
    </Flex>
  );
};

export default SubscriberFull;
