const moment = require("moment");

import StatsApi from "../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    let resp = [];
    for (let i = 1; i <= 7; i++) {
      const feeCountPerDay = await new StatsApi(req).getTotalFee(i);
      resp.push({
        date: moment(feeCountPerDay?.date).format("YYYY-MM-DD"),
        collected_fee_in_yoctonear: feeCountPerDay?.fee,
      });
    }
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
