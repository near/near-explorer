import BN from "bn.js";

import { DATA_SOURCE_TYPE } from "../consts";

import { ExplorerApi } from ".";

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  totalSupply?: string;
  prevHash: string;
  transactionsCount: number;
  gasPrice?: string;
  gasUsed?: string;
}

export default class BlocksApi extends ExplorerApi {
  async getBlocks(
    limit = 15,
    paginationIndexer?: number
  ): Promise<BlockInfo[]> {
    try {
      let blocks;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        blocks = await this.call<BlockInfo[]>("select", [
          `SELECT
              blocks.*,
              COUNT(transactions.hash) AS transactions_count
            FROM (
              SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash
              FROM blocks
              ${
                paginationIndexer
                  ? `WHERE blocks.timestamp < :paginationIndexer`
                  : ""
              }
              ORDER BY blocks.height DESC
              LIMIT :limit
            ) as blocks
            LEFT JOIN transactions ON transactions.block_hash = blocks.hash
            GROUP BY blocks.hash
            ORDER BY blocks.timestamp DESC`,
          {
            limit,
            paginationIndexer,
          },
        ]);
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        blocks = await this.call<BlockInfo[]>("select:INDEXER_BACKEND", [
          `SELECT
              blocks.block_hash AS hash,
              blocks.block_height AS height,
              DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
              blocks.prev_block_hash AS prev_hash,
              COUNT(transactions.transaction_hash) AS transactions_count
            FROM (
              SELECT blocks.block_hash AS block_hash
              FROM blocks
              ${
                paginationIndexer
                  ? `WHERE blocks.block_timestamp < :paginationIndexer`
                  : ""
              }
              ORDER BY blocks.block_height DESC
              LIMIT :limit
            ) as innerblocks
            LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
            LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
            GROUP BY blocks.block_hash
            ORDER BY blocks.block_timestamp DESC`,
          {
            limit,
            paginationIndexer,
          },
        ]);
      } else {
        throw Error(`unsupported data source ${this.dataSource}`);
      }
      blocks = blocks.map((block: any) => {
        return {
          hash: block.hash,
          height: block.height,
          timestamp: parseInt(block.timestamp),
          prevHash: block.prev_hash,
          transactionsCount: block.transactions_count,
        };
      });
      return blocks;
    } catch (error) {
      console.error("Blocks.getBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlockInfo(blockId: string | number): Promise<BlockInfo> {
    try {
      let block;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        block = await this.call<any>("select", [
          `SELECT
              blocks.*,
              COUNT(transactions.hash) AS transactions_count
            FROM (
              SELECT
                blocks.hash,
                blocks.height,
                blocks.timestamp,
                blocks.prev_hash,
                blocks.gas_price
              FROM blocks
              ${
                typeof blockId === "string"
                  ? `WHERE blocks.hash = :blockId`
                  : `WHERE blocks.height = :blockId`
              }
            ) AS blocks
            LEFT JOIN transactions ON transactions.block_hash = blocks.hash`,
          {
            blockId,
          },
        ]).then((it) => (it.length === 0 || !it[0].hash ? undefined : it[0]));
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        block = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT
              blocks.block_hash AS hash,
              blocks.block_height AS height,
              DIV(blocks.block_timestamp, 1000*1000) AS timestamp,
              blocks.prev_block_hash AS prev_hash,
              blocks.gas_price AS gas_price,
              blocks.total_supply AS total_supply,
              COUNT(transactions.transaction_hash) AS transactions_count
            FROM (
              SELECT blocks.block_hash AS block_hash
              FROM blocks
              ${
                typeof blockId === "string"
                  ? `WHERE blocks.block_hash = :blockId`
                  : `WHERE blocks.block_height = :blockId`
              }
            ) as innerblocks
            LEFT JOIN transactions ON transactions.included_in_block_hash = innerblocks.block_hash
            LEFT JOIN blocks ON blocks.block_hash = innerblocks.block_hash
            GROUP BY blocks.block_hash
            ORDER BY blocks.block_timestamp DESC`,
          {
            blockId,
          },
        ]).then((it) => (it.length === 0 ? undefined : it[0]));
      } else {
        throw Error(`unsupported data source ${this.dataSource}`);
      }

      if (block === undefined) {
        throw new Error("block not found");
      } else {
        let gasUsedResult;
        if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
          gasUsedResult = await this.call<any>("select", [
            `SELECT gas_used FROM chunks WHERE block_hash = :block_hash`,
            {
              block_hash: block.hash,
            },
          ]);
        } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
          gasUsedResult = await this.call<any>("select:INDEXER_BACKEND", [
            `SELECT gas_used FROM chunks WHERE included_in_block_hash = :block_hash`,
            {
              block_hash: block.hash,
            },
          ]);
        } else {
          throw Error(`unsupported data source ${this.dataSource}`);
        }
        let gasUsedArray = gasUsedResult.map(
          (gas: any) => new BN(gas.gas_used)
        );
        let gasUsed = gasUsedArray.reduce(
          (gas: BN, currentGas: BN) => gas.add(currentGas),
          new BN(0)
        );
        block.gasUsed = gasUsed.toString();
      }

      return {
        gasUsed: block.gasUsed,
        gasPrice: block.gas_price,
        hash: block.hash,
        height: block.height,
        prevHash: block.prev_hash,
        timestamp: parseInt(block.timestamp),
        transactionsCount: block.transactions_count,
        totalSupply: block.total_supply,
      } as BlockInfo;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
