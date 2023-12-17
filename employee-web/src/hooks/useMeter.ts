import IMeter from "../types/Meter";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, authorizedPut, apiError, serverError } = useRequest();
  const switchMeter = async (meterId: string, state: boolean) => {
    const response = await authorizedPut(
      `${import.meta.env.VITE_API_URI}/meter/${meterId}/switch`,
      { state }
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return;
    } else if (response.errorCode) {
      console.error(response);
      return;
    }

    const report = response.body as {
      meter: IMeter;
    };

    return report;
  };

  return { isLoading, apiError, serverError, switchMeter };
};
