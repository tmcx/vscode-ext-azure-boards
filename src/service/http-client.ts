import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { globalState } from "../extension";
import { IRequestConfig } from "../interfaces/http-client";

export class HttpClientService {
  async execRequest<T>(config: IRequestConfig): Promise<T> {
    const auth = {
      username: globalState.mail,
      password: globalState.patToken,
    };
    let reqConfig: AxiosRequestConfig = {
      auth,
      method: config.method,
      url: config.url,
      timeout: 5000,
    };
    reqConfig["data"] = config.data;
    const maxRetry = 3;
    let retry = 0;
    do {
      try {
        const response = await Axios(reqConfig);
        return response.data as T;
      } catch (error) {
        if (retry === maxRetry) {
          console.error(reqConfig);
          const axiosError = error as AxiosError;
          throw new Error(axiosError.message);
        }
        retry++;
      }
    } while (retry < maxRetry);
    throw new Error("");
  }

  async get<T>(url: string) {
    const httpConfig: IRequestConfig = {
      method: "GET",
      url,
    };
    return this.execRequest<T>(httpConfig);
  }

  async post<T>(url: string, data: any) {
    const httpConfig: IRequestConfig = {
      method: "POST",
      url,
      data,
    };
    return this.execRequest<T>(httpConfig);
  }
}
