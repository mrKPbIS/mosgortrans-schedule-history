export enum ROUTE_TYPE {
  TROLLEY = 'trol',
  BUS = 'avto',
  TRAM = 'tram',
}

export enum ROUTE_DIRECTION {
  REGULAR = 'AB',
  REVERSE = 'BA',
}

export enum ROUTE_DAYS {
  WEEKDAYS = '1111100',
  HOLIDAYS = '0000011'
}

export enum ROUTE_STOPS {
  NO_STOPS = 0,
  ALL_STOPS = 'all'
}

export enum LIST_PARAMS {
  ROUTES = 'ways',
  DAYS = 'days',
  DIRECTIONS = 'directions',
  stops = 'waypoints',
}
