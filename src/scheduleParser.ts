import { JSDOM } from 'jsdom';
import { writeFile } from 'fs';
import { format } from 'date-fns';
import { MosgortransClient } from './mgt-client/MosgortransClient';
import { ROUTE_TYPE, ROUTE_DIRECTION, ROUTE_DAYS, ROUTE_STOPS } from './mgt-client/dto/MosgortransRequestConstants';


export class ScheduleParser {
  private mgtClient: MosgortransClient;
  constructor() {
    this.mgtClient = new MosgortransClient();
  }

  async getAllRoutes() {
    const busResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE.BUS,
    });
    const trolResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE.TROLLEY,
    });
    const tramResponse = this.mgtClient.getRoutesList({
      type: ROUTE_TYPE.TRAM,
    });
    const [bus, trolley, tram] = await (await Promise.all([busResponse, trolResponse, tramResponse])).map(item => this.parseList(item));
    this.saveRoutes(trolley, ROUTE_TYPE.TROLLEY);
    this.saveRoutes(tram, ROUTE_TYPE.TRAM);
    this.saveRoutes(bus, ROUTE_TYPE.BUS);
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

  private async saveRoutes(transportList, type) {
    let i = 0;
    while(true) {
      const item = transportList[i];
      try {
        const htmlWeekdays = await this.mgtClient.getRouteSchedule({
          type: type,
          route: item,
          days: ROUTE_DAYS.WEEKDAYS,
          direction: ROUTE_DIRECTION.REGULAR,
          waypoints: ROUTE_STOPS.ALL_STOPS
        });
        await this.saveRawHtml(htmlWeekdays, `./routes/${type}_${item}_weekdays_${format(Date.now(), 'yyyy-MM-dd')}.html`);
        const htmlHolidays = await this.mgtClient.getRouteSchedule({
          type: type,
          route: item,
          days: ROUTE_DAYS.HOLIDAYS,
          direction: ROUTE_DIRECTION.REGULAR,
          waypoints: ROUTE_STOPS.ALL_STOPS
        });
        await this.saveRawHtml(htmlHolidays, `./routes/${type}_${item}_holidays_${format(Date.now(), 'yyyy-MM-dd')}.html`);
        i++;
        if (i == transportList.length) {
          break;
        }
      } catch(err) {
        console.log(`${err} with ${item}`);
      }
    }
  }

  private async saveRawHtml(html, path) {
    writeFile(path, html, 'utf-8', (errWrite) => {
      if (errWrite) {
        console.log(`unable to write ${path}`)
      } else {
        console.log(`${path} created`)
      }
    });
    return await new Promise((resolve, _) => {
      setTimeout(() => resolve(
      ), 100);
    });
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