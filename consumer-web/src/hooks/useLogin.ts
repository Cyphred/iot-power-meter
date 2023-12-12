import useRequest from "./useRequest";
import { useAppDispatch } from "../redux/hooks";
import { setToken, setUser } from "../redux/auth";
import IConsumer from "../types/Consumer";
import { setMeter } from "../redux/meter";
import IMeter from "../types/Meter";

export default function useLogin() {
  const { post, isLoading, apiError, serverError } = useRequest();
  const dispatch = useAppDispatch();

  async function login(email: string, password: string) {
    const response = await post(
      `${import.meta.env.VITE_API_URI}/login?type=consumer`,
      {
        email,
        password,
      }
    );

    if (!response) {
      console.error(apiError);
      console.error(serverError);
      return;
    }

    const body = response.body as {
      token: string;
      consumer: IConsumer;
      meter?: IMeter;
    };

    localStorage.setItem("userToken", body.token);
    dispatch(setToken(body.token));
    dispatch(setUser(body.consumer));

    if (body.meter) {
      dispatch(setMeter(body.meter));
    }
  }

  return { isLoading, apiError, serverError, login };
}
