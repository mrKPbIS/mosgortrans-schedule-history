
import * as req from 'request';
import * as qs from 'querystring';
import { LIST_ROUTES, NO_STOPS, LIST_DAYS, LIST_DIRECTIONS } from './dto/MosgortransRequestConstants';
import { convertWin1251BufToUtf8, convertToUri } from '../utils/CharsetConverter';
import { readFile } from 'fs';

export class MosgortransClient {
  private MGT_URI;
  private MGT_LIST_URI;
  private MGT_SCHEDULE_URI;

  constructor() {
    this.MGT_URI = 'http://mosgortrans.org/pass3';
    this.MGT_LIST_URI = `${this.MGT_URI}/request.ajax.php`;
    this.MGT_SCHEDULE_URI = `${this.MGT_URI}/shedule.php`;
  }
   
  getRouteSchedule({ type, route, days, direction, waypoints }: { type: string, route: string, days: string, direction: string, waypoints: string | number}) {
    const requestQuery = {
      type,
      way: route,
      date: days,
      direction,
      waypoint: waypoints,
    };
    return this.makeGetRequest(this.MGT_SCHEDULE_URI, requestQuery);
  }

  getRoutesList({ type }: { type: string }) {
    const requestQuery = {
      list: LIST_ROUTES,
      type,
      waypoint: NO_STOPS,
    }
    return this.makeGetRequest(this.MGT_LIST_URI, requestQuery);
  }

  getRouteDays({ type, route }: {type: string; route: string }) {
    const requestQuery = {
      list: LIST_DAYS,
      type,
      way: route,
      waypoint: NO_STOPS,
    }
    return this.makeGetRequest(this.MGT_LIST_URI, requestQuery);
  }

  getRouteDirections({ type, route, days }) {
    const requestQuery = {
      list: LIST_DIRECTIONS,
      type,
      way: route,
      date: days,
      waypoint: NO_STOPS,
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