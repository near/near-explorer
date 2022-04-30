import { NextApiHandler } from "next";
import { getNearNetwork } from "../../libraries/config";
import { getFetcher } from "../../libraries/transport";

const handler: NextApiHandler = async (req, res) => {
  try {
    const nearNetwork = getNearNetwork(req.query, req.headers.host);
    await getFetcher(nearNetwork)("nearcore-status", []);
  } catch (error) {
    res.status(502).send(error);
    return;
  }
  res.send({});
};

export default handler;
