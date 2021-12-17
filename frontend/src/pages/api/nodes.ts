import { NextApiHandler } from "next";
import { ExplorerApi } from "../../libraries/explorer-wamp";

const handler: NextApiHandler = async (req, res) => {
  try {
    let ip_address =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    res.send({});

    new ExplorerApi(req)
      .call("node-telemetry", [
        {
          ...req.body,
          ip_address: ip_address,
        },
      ])
      .catch(() => {});
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    return;
  }
};

export default handler;
