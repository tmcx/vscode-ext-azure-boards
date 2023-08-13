import { Method } from "axios";

export interface IRequestConfig {
  url: string;
  method: Method;
  data?: { [key: string]: any };
}
