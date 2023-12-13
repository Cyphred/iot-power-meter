import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMeter } from "../redux/meter";
import { setConsumption } from "../redux/stats";
import IConsumptionReport from "../types/ConsumptionReport";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet } = useRequest();
  const dispatch = useAppDispatch();
  const consumer = useAppSelector((state) => state.auth.user);

  const getConsumptionReport = async (consumerId?: string) => {
    let target: string;

    if (consumerId) target = consumerId;
    else if (consumer) {
      target = consumer._id;
    } else {
      return; // Do not proceed if there is no consumer targeted
    }

    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/reports/consumption/${target}`
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return;
    } else if (response.errorCode) {
      console.error(response);
      return;
    }

    const report = response.body as IConsumptionReport;

    dispatch(setConsumption(report));
    dispatch(setMeter(report.meter));
    return report;
  };

  return { isLoading, apiError, serverError, getConsumptionReport };
};
