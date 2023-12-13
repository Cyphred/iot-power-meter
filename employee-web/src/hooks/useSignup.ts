import useRequest from "./useRequest";

export default () => {
  const { isLoading, apiError, serverError, post } = useRequest();

  const signup = async (employeeData: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  }) => {
    const response = await post(
      `${import.meta.env.VITE_API_URI}/register/employee`,
      employeeData
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
