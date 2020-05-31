
import * as req from 'request';
import * as qs from 'querystring';
import { readFile } from 'fs';
import { ROUTE_STOPS, LIST_PARAMS } from './dto/MosgortransRequestConstants';
import { convertWin1251BufToUtf8, convertToUri } from '../utils/CharsetConverter';
import { GetRoutesListRequest } from './dto/GetRoutesListRequest';
import { GetRouteDaysRequest } from './dto/GetRouteDaysRequest';
import { GetRouteDirectionsRequest } from './dto/GetRouteDirectionsRequest';
import { GetRouteScheduleRequest } from './dto/GetRouteScheduleRequest';

export class MosgortransClient {
  private MGT_URI;
  private MGT_LIST_URI;
  private MGT_SCHEDULE_URI;

  constructor() {
    this.MGT_URI = 'http://mosgortrans.org/pass3';
    this.MGT_LIST_URI = `${this.MGT_URI}/request.ajax.php`;
    this.MGT_SCHEDULE_URI = `${this.MGT_URI}/shedule.php`;
  }
   
  getRouteSchedule({ type, route, days, direction, waypoints }: GetRouteScheduleRequest) {
    const requestQuery = {
      type,
      way: route,
      date: days,
      direction,
      waypoint: waypoints,
    };
    return this.makeGetRequest(this.MGT_SCHEDULE_URI, requestQuery);
  }

  getRoutesList({ type }: GetRoutesListRequest) {
    const requestQuery = {
      list: LIST_PARAMS.ROUTES,
      type,
      waypoint: ROUTE_STOPS.NO_STOPS,
    }
    return this.makeGetRequest(this.MGT_LIST_URI, requestQuery);
  }

  getRouteDays({ type, route }: GetRouteDaysRequest) {
    const requestQuery = {
      list: LIST_PARAMS.DAYS,
      type,
      way: route,
      waypoint: ROUTE_STOPS.NO_STOPS,
    }
    return this.makeGetRequest(this.MGT_LIST_URI, requestQuery);
  }

  getRouteDirections({ type, route, days }: GetRouteDirectionsRequest) {
    const requestQuery = {
      list: LIST_PARAMS.DIRECTIONS,
      type,
      way: route,
      date: days,
      waypoint: ROUTE_STOPS.NO_STOPS,
    };
    return this.makeGetRequest(this.MGT_LIST_URI, requestQuery);
  }

  private makeFileRequest(uri, requestQuery) {
    return new Promise((resolve, reject) => {
      readFile('./src/mgt-client/test-schedule-response.html', (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(convertWin1251BufToUtf8(data))
        }
      });
    });
  }
  
  private makeGetRequest(uri, requestQuery): Promise<string> {
    const requestUri = `${uri}?${qs.stringify(requestQuery,'&', '=', {
      encodeURIComponent: convertToUri,
    })}`;
    console.log(`request: ${requestUri}`);
    return new Promise((resolve, reject) => {
      req.get(requestUri, {encoding: null }, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          resolve(convertWin1251BufToUtf8(body))
        }
      })
    });
  }
}