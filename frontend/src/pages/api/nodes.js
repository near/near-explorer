import { ExplorerApi } from "../../libraries/explorer-wamp";

export default async function (req, res) {
  try {
    let ip_address =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    res.send({});

    return await new ExplorerApi(req).call("node-telemetry", [
      {
        ...req.body,
        ip_address: ip_address,
      },
    ]);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
