import IConsumer from "../types/Consumer";
import IMeter from "../types/Meter";
import useRequest from "./useRequest";

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

    interface ConsumerListResponseItem {
      consumer: IConsumer;
      meter: IMeter | null | undefined;
    }

    const parsed = response.body as { consumers: ConsumerListResponseItem[] };

    return parsed.consumers;
  };

  return { isLoading, apiError, serverError, getSubscribers };
};
