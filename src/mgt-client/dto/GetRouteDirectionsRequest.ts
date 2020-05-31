import { ROUTE_TYPE, ROUTE_DAYS } from "./MosgortransRequestConstants";

export interface GetRouteDirectionsRequest {
  type: ROUTE_TYPE;
  route: string;
  days: ROUTE_DAYS;
}
