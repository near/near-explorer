import { NextApiHandler } from "next";
import { getNearNetworkName } from "../../libraries/config";
import { getFetcher } from "../../libraries/transport";

const handler: NextApiHandler = async (req, res) => {
  try {
    let ip_address =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    res.send({});

    const networkName = getNearNetworkName(req.query, req.headers.host);

    getFetcher(networkName)("node-telemetry", [
      {
        ...req.body,
        ip_address: ip_address,
      },
    ]).catch(() => {});
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(400).send(error);
    return;
  }
};

export default handler;
