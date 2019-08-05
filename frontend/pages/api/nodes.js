import { call } from "../../api";

export default async function(req, res) {
  try {
    await call(".node-telemetry", [
      {
        ...req.body,
        ip_address: req.socket.remoteAddress
      }
    ]);
  } catch (error) {
    res.status(400).send(error);
    return;
  }
  res.send({});
}
