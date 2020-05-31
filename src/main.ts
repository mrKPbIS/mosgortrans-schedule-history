import { MosgortransClient } from './mgt-client/MosgortransClient';
import { ROUTE_TYPE_TROLLEY, ROUTE_WEEKDAYS, ROUTE_DIRECTION, ALL_STOPS, ROUTE_TYPE_BUS } from './mgt-client/dto/MosgortransRequestConstants';
import { ScheduleParser } from './scheduleParser';
import { convertUtf8ToWin1251Buf } from './utils/CharsetConverter';


const mgtClient = new MosgortransClient();
const scheduleParser = new ScheduleParser();

// const response = mgtClient.getRouteDirections({
//   type: ROUTE_TYPE_TROLLEY,
//   route: 4,
//   days: ROUTE_WEEKDAYS,
// }).then(
//     (resp) => {
//       console.log(resp);
//     },
//     (err) => {
//       console.log(err)
//     }
//   )


// const scheduleResponse = scheduleParser.getRouteSchedule({
//   type: ROUTE_TYPE_TROLLEY,
//   route: '60',
//   days: ROUTE_WEEKDAYS,
//   direction: ROUTE_DIRECTION,
//   waypoints: ALL_STOPS
// });



const scheduleResponse = scheduleParser.getAllRoutes().then(
  (resp) => {
    console.log(JSON.stringify(resp))
  },
  (err) => {
    console.log(err)
  }
)
