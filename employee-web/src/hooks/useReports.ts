import IConsumptionReport from "../types/ConsumptionReport";
import { useLogout } from "./useLogout";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet, authorizedPost } =
    useRequest();
  const { logout } = useLogout();

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

    return report;
  };

  const resetEverything = async () => {
    const response = await authorizedPost(
      `${import.meta.env.VITE_API_URI}/reports/consumption`,
      {}
    );

    if (response && !response.errorCode) logout();
    else alert(response?.message);
  };

  return {
    isLoading,
    apiError,
    serverError,
    getConsumptionReport,
    resetEverything,
  };
};
