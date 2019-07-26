import { call } from "../../api";

export default async function(req, res) {
  await call(".node-telemetry", [
    {
      ...req.body,
      ip_address: req.socket.remoteAddress
    }
  ]);
  res.end("");
}
