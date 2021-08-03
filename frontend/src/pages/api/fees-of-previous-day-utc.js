const moment = require("moment");

import StatsApi from "../../libraries/explorer-wamp/stats";

export default async function (req, res) {
  try {
    const feeCountPerDay = await new StatsApi(req).getTotalFee(1);
    const resp = {
      date: moment(feeCountPerDay[0]?.date).format("YYYY-MM-DD"),
      collected_fee_in_yoctonear: feeCountPerDay[0]?.fee,
    };
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(502).send(error);
  }
}
