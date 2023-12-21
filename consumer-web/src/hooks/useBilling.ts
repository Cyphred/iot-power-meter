import IBilling from "../types/Billing";
import useRequest from "./useRequest";

export default () => {
  const { authorizedGet, apiError, serverError } = useRequest();

  const getPendingBill = async (consumerId: string) => {
    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/billing/${consumerId}/pending`
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return;
    } else if (response.errorCode) {
      console.error(response);
      return;
    }

    const bill = response?.body as { bill: IBilling | null };

    return bill;
  };

  return { getPendingBill };
};
