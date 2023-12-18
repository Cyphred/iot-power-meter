import IBilling from "../types/Billing";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet } = useRequest();

  const getPendingBill = async (consumerId: string) => {
    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/billing/${consumerId}/pending`
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return;
    }

    if (apiError || serverError) {
      if (apiError) console.error(apiError);
      if (serverError) console.error(serverError);
      return;
    }

    const { bill } = response.body as { bill: IBilling | null };

    return bill;
  };

  return {
    isLoading,
    apiError,
    serverError,
    getPendingBill,
  };
};
