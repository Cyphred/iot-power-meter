import IConsumptionReport from "../types/ConsumptionReport";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet } = useRequest();

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

    return response.body as IConsumptionReport;
  };

  return { isLoading, apiError, serverError, getConsumptionReport };
};
