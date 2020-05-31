import { ROUTE_TYPE } from "./MosgortransRequestConstants";

export interface GetRouteDaysRequest {
  type: ROUTE_TYPE;
  route: string;
}