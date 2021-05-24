import { ExplorerApi } from ".";

export interface CirculatingSupply {
  block_height: number;
  circulating_supply_in_yoctonear: string;
}

export default class DetailsApi extends ExplorerApi {
  async calculateCirculatingSupply(): Promise<CirculatingSupply> {
    return await this.call<CirculatingSupply>("calculate-circulating-supply");
  }
}
