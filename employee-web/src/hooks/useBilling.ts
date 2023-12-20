import IBilling from "../types/Billing";
import ICutoff from "../types/Cutoff";
import IRate from "../types/Rates";
import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, authorizedGet, authorizedPost } =
    useRequest();

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

  const generateBills = async () => {
    const response = await authorizedPost(
      `${import.meta.env.VITE_API_URI}/billing/generate-for-all`,
      {
        breakdown: [
          {
            description: "System generation charge",
            amount: 9.99,
          },
          {
            description: "Misc charge 1",
            amount: 1.23,
          },
          {
            description: "Misc charge 2",
            amount: 0.003,
          },
        ],
      }
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

    const { billsCreated, rate, cutoff } = response.body as {
      billsCreated: IBilling;
      rate: IRate;
      cutoff: ICutoff;
    };

    return { billsCreated, rate, cutoff };
  };

  return {
    isLoading,
    apiError,
    serverError,
    getPendingBill,
    generateBills,
  };
};
