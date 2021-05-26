import BN from "bn.js";

import { ExplorerApi } from ".";

export interface CirculatingSupply {
  blockHeight: number;
  circulatingSupplyInYoctonear: BN;
}

export default class DetailsApi extends ExplorerApi {
  async getLatestCirculatingSupply(): Promise<CirculatingSupply> {
    const { block_height, circulating_supply_in_yoctonear } = await this.call(
      "get-latest-circulating-supply"
    );
    return {
      blockHeight: block_height,
      circulatingSupplyInYoctonear: new BN(circulating_supply_in_yoctonear),
    };
  }
}
