import React from "react";
import { useState } from "react";
import IApiError from "../src/types/ApiError";
import axios, { AxiosResponse } from "axios";
import IApiResponse from "../src/types/ApiResponse";
import IServerError from "../src/types/ServerError";
import { useAppSelector } from "../src/redux/hooks";

export default function useRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]: [
    IApiError | undefined,
    React.Dispatch<React.SetStateAction<IApiError | undefined>>
  ] = useState();
  const [serverError, setServerError]: [
    IServerError | undefined,
    React.Dispatch<React.SetStateAction<IServerError | undefined>>
  ] = useState();

  const { token } = useAppSelector((state) => state.auth);

  // Determines if postman mock mode is enabled
  const isPostmanMockMode =
    import.meta.env.VITE_POSTMAN_MOCK_MODE === "1" ? true : false;

  const genericPost = async (url: string, body: unknown, token?: string) => {
    setIsLoading(true);
    setApiError(undefined);
    setServerError(undefined);

    interface IAxiosErrorResponse {
      response: {
        status: number;
        message: string;
      };
    }

    // Store config before sending request
    const headers: {
      Authorization?: string;
      "x-mock-match-request-body"?: string;
    } = {};

    // Adds authorization token if a token is provided
    if (token) headers.Authorization = `Bearer ${token}`;

    if (isPostmanMockMode) headers["x-mock-match-request-body"] = "true";

    let returnData: IApiResponse | undefined;

    await axios
      .post(url, body, { headers })
      .then((response) => {
        setIsLoading(false);

        // Parse the response as the formatted API response
        const data = response.data as IApiResponse;

        // Check if the response contains an error code.
        // This indicates that an error has occurred on the server side.
        if (data.errorCode) {
          // If an error has occured, parse the data and save it to state
          setApiError({ errorCode: data.errorCode, message: data.message });

          // Do not update returnData to indicate a failure
        }

        // Returns the regular data's body if no error has occurred.
        returnData = data;
      })
      .catch((error) => {
        setIsLoading(false);
        const { response } = error as IAxiosErrorResponse;

        // Attempt to extract error data from the error object
        const errorResponse: IServerError = {
          status: response.status ? response.status : 999,
          message: response.message ? response.message : "Something went wrong",
        };

        setServerError(errorResponse);

        // Do not update returnData to indicate a failure
      });

    return returnData;
  };

  const genericGet = async (url: string, token?: string) => {
    setIsLoading(true);
    setApiError(undefined);
    setServerError(undefined);

    interface IAxiosErrorResponse {
      response: AxiosResponse<unknown, unknown>;
    }

    // Store config before sending request
    const headers: {
      Authorization?: string;
      "x-mock-match-request-body"?: string;
    } = {};

    // Adds authorization token if a token is provided
    if (token) headers.Authorization = `Bearer ${token}`;

    if (isPostmanMockMode) headers["x-mock-match-request-body"] = "true";

    let returnData: IApiResponse | undefined;

    await axios
      .get(url, { headers })
      .then((response) => {
        setIsLoading(false);

        // Parse the response as the formatted API response
        const data = response.data as IApiResponse;

        // Check if the response contains an error code.
        // This indicates that an error has occurred on the server side.
        if (data.errorCode) {
          // If an error has occured, parse the data and save it to state
          setApiError({ errorCode: data.errorCode, message: data.message });

          // Do not update returnData to indicate a failure
        }

        // Returns the regular data's body if no error has occurred.
        returnData = data;
      })
      .catch((error) => {
        setIsLoading(false);
        const { response } = error as IAxiosErrorResponse;

        // Attempt to extract error data from the error object
        const errorResponse: IServerError = {
          status: response.status ? response.status : 999,
          message: response.statusText
            ? response.statusText
            : "Something went wrong",
        };

        setServerError(errorResponse);

        // Do not update returnData to indicate a failure
      });

    return returnData;
  };

  const genericPut = async (url: string, body: unknown, token?: string) => {
    setIsLoading(true);
    setApiError(undefined);
    setServerError(undefined);

    interface IAxiosErrorResponse {
      response: AxiosResponse<unknown, unknown>;
    }

    // Store config before sending request
    const headers: {
      Authorization?: string;
      "x-mock-match-request-body"?: string;
    } = {};

    // Adds authorization token if a token is provided
    if (token) headers.Authorization = `Bearer ${token}`;

    if (isPostmanMockMode) headers["x-mock-match-request-body"] = "true";

    let returnData: IApiResponse | undefined;

    await axios
      .put(url, body, { headers })
      .then((response) => {
        setIsLoading(false);

        // Parse the response as the formatted API response
        const data = response.data as IApiResponse;

        // Check if the response contains an error code.
        // This indicates that an error has occurred on the server side.
        if (data.errorCode) {
          // If an error has occured, parse the data and save it to state
          setApiError({ errorCode: data.errorCode, message: data.message });

          // Do not update returnData to indicate a failure
        }

        // Returns the regular data's body if no error has occurred.
        returnData = data;
      })
      .catch((error) => {
        setIsLoading(false);
        const { response } = error as IAxiosErrorResponse;

        // Attempt to extract error data from the error object
        const errorResponse: IServerError = {
          status: response.status ? response.status : 999,
          message: response.statusText
            ? response.statusText
            : "Something went wrong",
        };

        setServerError(errorResponse);

        // Do not update returnData to indicate a failure
      });

    return returnData;
  };

  const post = async (url: string, body: unknown) => {
    return await genericPost(url, body);
  };

  const authorizedPost = async (url: string, body: unknown) => {
    if (token) return await genericPost(url, body, token);
  };

  const get = async (url: string) => {
    return await genericGet(url);
  };

  const authorizedGet = async (url: string) => {
    if (token) return await genericGet(url, token);
  };

  const authorizedPut = async (url: string, body: unknown) => {
    if (token) return await genericPut(url, body, token);
  };

  return {
    isLoading,
    apiError,
    serverError,
    post,
    authorizedPost,
    get,
    authorizedGet,
    authorizedPut,
  };
}
