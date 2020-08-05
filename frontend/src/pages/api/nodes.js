import IPData from "ipdata";
import { ExplorerApi } from "../../libraries/explorer-wamp";

const ipdata = new IPData(
  "c8b80db74e687b7471135f099c0332c36899f40df0a2716e7a66d57e"
);

export default async function (req, res) {
  try {
    let ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let node = await new ExplorerApi()
      .call("select", [
        `SELECT node_id as nodeId 
          FROM nodes
          WHERE ip_address = :ip_address
      `,
        { ip_address: "1.1.1.1" },
      ])
      .then((it) => it[0]);
    if (node) {
      res.send("already exists in database");
      return;
    } else {
      const fields = ["latitude", "longitude", "city"];
      let info = await ipdata.lookup(ip_address, fields);
      res.send("new node found and insert");
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
    res.status(400).send(error);
    return;
  }
}
