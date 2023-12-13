import { useAppDispatch } from "../redux/hooks";
import { setConsumption } from "../redux/stats";
import IConsumptionReport from "../types/ConsumptionReport";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet } = useRequest();
  const dispatch = useAppDispatch();

  const getConsumptionReport = async (consumerId: string) => {
    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/reports/consumption/${consumerId}`
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
    return report;
  };

  return { isLoading, apiError, serverError, getConsumptionReport };
};
