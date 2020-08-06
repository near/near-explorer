import IPData from "ipdata";
import { ExplorerApi } from "../../libraries/explorer-wamp";

const ipdata = new IPData(
  "c8b80db74e687b7471135f099c0332c36899f40df0a2716e7a66d57e"
);

export default async function (req, res) {
  try {
    let ip_address =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let node = await new ExplorerApi(req)
      .call("select", [
        `SELECT latitude, longitude, city
          FROM nodes
          WHERE ip_address = :ip_address
      `,
        { ip_address },
      ])
      .then((it) => it[0]);
    if (node) {
      res.send("ip already exists in database");
      return await new ExplorerApi(req).call("node-telemetry", [
        {
          ...req.body,
          ip_address: ip_address,
          latitude: node.latitude,
          longitude: node.longitude,
          city: node.city,
        },
      ]);
    } else {
      let info = await ipdata.lookup(ip_address);
      res.send("new ip found and insert");
      return await new ExplorerApi(req).call("node-telemetry", [
        {
          ...req.body,
          ip_address: ip_address,
          latitude: info.latitude,
          longitude: info.longitude,
          city: info.city,
        },
      ]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
}
