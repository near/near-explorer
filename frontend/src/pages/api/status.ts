import { NextApiHandler } from "next";
import { getNearNetwork } from "../../libraries/config";
import wampApi from "../../libraries/wamp/api";

const handler: NextApiHandler = async (req, res) => {
  try {
    const nearNetwork = getNearNetwork(req.query, req.headers.host);
    await wampApi.getCall(nearNetwork)("nearcore-status", []);
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
