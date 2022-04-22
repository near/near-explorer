import moment from "moment";
import { NextApiHandler } from "next";
import { getNearNetwork } from "../../libraries/config";
import wampApi from "../../libraries/wamp/api";

const handler: NextApiHandler = async (req, res) => {
  try {
    const nearNetwork = getNearNetwork(req.query, req.headers.host);
    let resp = [];
    for (let i = 1; i <= 7; i++) {
      const feeCountPerDay = await wampApi.getCall(
        nearNetwork
      )("nearcore-total-fee-count", [i]);
      if (!feeCountPerDay) {
        return res.status(500).end();
      }
      resp.push({
        date: moment(feeCountPerDay?.date).format("YYYY-MM-DD"),
        collected_fee_in_yoctonear: feeCountPerDay?.fee,
      });
    }
    res.send(resp);
  } catch (error) {
    console.error(`Handler ${req.url} failed:`, error);
    res.status(502).send(error);
  }
};

export default handler;
