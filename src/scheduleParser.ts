import { JSDOM } from 'jsdom';
import { writeFile } from 'fs';
import {} from 'date-fns';
import { MosgortransClient } from './mgt-client/MosgortransClient';
import { ROUTE_TYPE_BUS, ROUTE_TYPE_TROLLEY, ROUTE_TYPE_TRAM, ROUTE_WEEKDAYS, ROUTE_DIRECTION, ALL_STOPS } from './mgt-client/dto/MosgortransRequestConstants';


export class ScheduleParser {
  private mgtClient: MosgortransClient;
  constructor() {
    this.mgtClient = new MosgortransClient();
  }

  async getAllRoutes() {
    const busResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE_BUS,
    });
    const trolResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE_TROLLEY,
    });
    const tramResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE_TRAM,
    });
    const [bus, trolley, tram] = await (await Promise.all([busResponse, trolResponse, tramResponse])).map(item => this.parseList(item));
    this.saveRawHtml(bus, ROUTE_TYPE_BUS);
    return {
      bus,
      trolley,
      tram,
    };
  }

  async getRouteSchedule({ type, route, days, direction, waypoints }) {
    const scheduleResponse = await this.mgtClient.getRouteSchedule({ type, route, days, direction, waypoints });
    return this.parseSchedule(scheduleResponse);
  }

  private async saveRawHtml(transportList, type) {
    let i = 0;
    while(true) {
      const item = transportList[i];
      try {
        const rawHtml = await this.mgtClient.getRouteSchedule({
          type: type,
          route: item,
          days: ROUTE_WEEKDAYS,
          direction: ROUTE_DIRECTION,
          waypoints: ALL_STOPS
        });
        console.log(`${item} successful`);
        writeFile(`./routes/${type}_${item}_${Date.now()}.html`, rawHtml, 'utf-8', (errWrite) => {
          if (errWrite) {
            console.log(`unable to write ${type} ${item}`)
          } else {
            console.log(`${type} ${item} successfully written`)
          }
        });
        await new Promise((resolve, reject) => {
          setTimeout(() => resolve(
          ), 100);
        });
        i++;
        if (i == transportList.length) {
          break;
        }
      } catch(err) {
        console.log(`${err} with ${item}`);
      }
    }
  }

  private parseList(resp) {
    return resp.trim().split('\n');
  }

  private parseSchedule(resp) {
    //class bottomwideborder for tables
    //element h2 for stop names
    const respDom = new JSDOM(resp);
    const respDocument = respDom.window.document;
    const stops = Array.from(respDocument.getElementsByTagName('h2'))
    const tables = Array.from(respDocument.getElementsByClassName('bottomwideborder'))
  }
}