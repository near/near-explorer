import { NextApiHandler } from "next";
import { getNearNetwork } from "../../libraries/config";
import wampApi from "../../libraries/wamp/api";

const handler: NextApiHandler = async (req, res) => {
  try {
    let ip_address =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    res.send({});

    const nearNetwork = getNearNetwork(req);

    wampApi
      .getCall(nearNetwork)("node-telemetry", [
        {
          ...req.body,
          ip_address: ip_address,
        },
      ])
      .catch(() => {});
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(400).send(error);
    return;
  }
};

export default handler;
