const moment = require("moment");

import StatsApi from "../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const feeCountPerDay = await new StatsApi(req).getTotalFee(7);
    const resp = feeCountPerDay
      .map((i) => ({
        date: moment(i?.date).format("YYYY-MM-DD"),
        collected_fee_in_yoctonear: i?.fee,
      }))
      .slice(0, 7);
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
