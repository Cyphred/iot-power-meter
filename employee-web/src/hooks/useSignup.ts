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
      return;
    } else if (apiError || serverError) {
      if (apiError) console.error(apiError);
      if (serverError) console.error(serverError);
      return;
    }

    return true;
  };

  return { isLoading, apiError, serverError, signup };
};
