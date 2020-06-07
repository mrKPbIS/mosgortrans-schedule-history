import * as express from 'express';
import { ScheduleParser } from './scheduleParser';

const app = express();
const port = 3000;
const scheduleParser = new ScheduleParser();

app.get('/all-routes', (req, res) => {
  scheduleParser.getAllRoutes();
  res.send();
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})