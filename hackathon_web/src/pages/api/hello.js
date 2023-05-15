// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { InfluxDB, Point } from '@influxdata/influxdb-client'

export default function handler(req, res) {
  const queryApi = new InfluxDB({YOUR_URL, YOUR_API_TOKEN}).getQueryApi(YOUR_ORG);
  res.status(200).json({ name: 'John Doe' });
}
