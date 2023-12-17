import IConsumer from "../types/Consumer";
import IMeter from "../types/Meter";
import useRequest from "./useRequest";
export interface IConsumerListResponseItem {
  consumer: IConsumer;
  meter: IMeter | null | undefined;
}

export default () => {
  const { isLoading, apiError, serverError, authorizedGet } = useRequest();

  const getSubscribers = async () => {
    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/consumers`
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

    const parsed = response.body as { consumers: IConsumerListResponseItem[] };

    return parsed.consumers;
  };

  const getSubscriberById = async (subscriberId: string) => {
    const response = await authorizedGet(
      `${import.meta.env.VITE_API_URI}/consumers/${subscriberId}`
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

    const parsed = response.body as { consumer: IConsumer; meter: IMeter };

    return parsed;
  };

  return {
    isLoading,
    apiError,
    serverError,
    getSubscribers,
    getSubscriberById,
  };
};
