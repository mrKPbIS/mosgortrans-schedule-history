import { MosgortransClient } from "../src/mgt-client/MosgortransClient";
import { ScheduleParser } from "../src/scheduleParser";
import { ROUTE_TYPE, ROUTE_DAYS, ROUTE_DIRECTION, ROUTE_STOPS } from "../src/mgt-client/dto/MosgortransRequestConstants";

const mgtClient = new MosgortransClient();
const scheduleParser = new ScheduleParser();

mgtClient.getRouteDirections({
  type: ROUTE_TYPE.TROLLEY,
  route: "4",
  days: ROUTE_DAYS.WEEKDAYS,
}).then(
    (resp) => {
      console.log(resp);
    },
    (err) => {
      console.log(err)
    }
  )


scheduleParser.getRouteSchedule({
  type: ROUTE_TYPE.TROLLEY,
  route: '60',
  days: ROUTE_DAYS.WEEKDAYS,
  direction: ROUTE_DIRECTION,
  waypoints: ROUTE_STOPS.ALL_STOPS
});



scheduleParser.getAllRoutes().then(
  (resp) => {
    console.log(JSON.stringify(resp))
  },
  (err) => {
    console.log(err)
  }
)
