import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, post } = useRequest();

  const signup = async (consumerData: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    streetAddress: string;
    barangay: string;
    city: string;
  }) => {
    const response = await post(
      `${import.meta.env.VITE_API_URI}/register/consumer`,
      consumerData
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return false;
    } else if (response.errorCode) {
      console.error(response);
      return false;
    }

    return true;
  };

  return { isLoading, apiError, serverError, signup };
};
