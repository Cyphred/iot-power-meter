import useRequest from "./useRequest";
import IEmployee from "../types/Employee";
import IMeter from "../types/Meter";

export default function useLogin() {
  const { post, isLoading, apiError, serverError } = useRequest();

  async function login(email: string, password: string) {
    const response = await post(
      `${import.meta.env.VITE_API_URI}/login?type=employee`,
      {
        email,
        password,
      }
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

    const body = response.body as {
      token: string;
      employee: IEmployee;
      meter?: IMeter;
    };

    localStorage.setItem("userToken", body.token);
    localStorage.setItem("user", JSON.stringify(body.employee));
  }

  return { isLoading, apiError, serverError, login };
}
