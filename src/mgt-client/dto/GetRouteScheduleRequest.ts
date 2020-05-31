import { ROUTE_TYPE, ROUTE_DAYS, ROUTE_DIRECTION, ROUTE_STOPS } from "./MosgortransRequestConstants";

export interface GetRouteScheduleRequest {
  type: ROUTE_TYPE;
  route: string;
  days: ROUTE_DAYS;
  direction: ROUTE_DIRECTION;
  waypoints: ROUTE_STOPS | number;
}