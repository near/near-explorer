import moment from "moment";
import BN from "bn.js";
import React, { useEffect, useState, useContext } from "react";
import { utils } from "near-api-js";

import StatsApi from "../../libraries/explorer-wamp/stats";
import { NetworkStatsContext } from "../../context/NetworkStatsProvider";

import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
import Balance, { formatWithCommas } from "../utils/Balance";
import NearBadge from "../nodes/NearBadge";

import { Translate } from "react-localize-redux";

const ProtocolConfigInfo = () => {
  const [totalGenesisSupply, setTotalGenesisSupply] = useState<BN>();
  const [
    genesisProtocolVersion,
    setGenesisProtocolVersion,
  ] = useState<number>();
  const [liveAccountsCount, setLiveAccountsCount] = useState<number>();
  const [genesisAccountsAmount, setGenesisAccountsAmount] = useState<number>();
  const [
    firstProducedBlockTimestamp,
    setFirstProducedBlockTimestamp,
  ] = useState<string>();

  const { networkStats, epochStartBlock } = useContext(NetworkStatsContext);

  let epochTotalSupply = epochStartBlock?.totalSupply
    ? new BN(epochStartBlock.totalSupply.toString())
        .div(utils.format.NEAR_NOMINATION)
        .toNumber() /
      10 ** 6
    : null;

  const genesisTotaSupply = totalGenesisSupply
    ? new BN(totalGenesisSupply.toString())
        .div(utils.format.NEAR_NOMINATION)
        .toNumber() /
      10 ** 6
    : null;

  useEffect(() => {
    if (networkStats?.genesisHeight) {
      new StatsApi()
        .networkGenesisProtocolConfig(networkStats.genesisHeight)
        .then((genesisBlockInfo: any) => {
          if (genesisBlockInfo) {
            setTotalGenesisSupply(genesisBlockInfo.header.total_supply);
            setGenesisProtocolVersion(
              genesisBlockInfo.header.latest_protocol_version
            );
          }
        });
    }
  }, [networkStats?.genesisHeight]);

  useEffect(() => {
    new StatsApi().liveAccountsCountAggregatedByDate().then((accounts) => {
      if (accounts?.length > 0) {
        const { accountsCount } = accounts[accounts.length - 1];
        setLiveAccountsCount(accountsCount);
      }
    });

    new StatsApi().genesisAccountsCount().then((count) => {
      if (count) {
        setGenesisAccountsAmount(count);
      }
    });

    new StatsApi().firstProducedBlockTimestamp().then((blockTimestamp) => {
      if (blockTimestamp) {
        setFirstProducedBlockTimestamp(blockTimestamp);
      }
    });
  }, []);

  return (
    <Translate>
      {({ translate }) => (
        <>
          <InfoCard className="protocol-config">
            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.first_produced_block"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
            >
              {firstProducedBlockTimestamp && (
                <span>
                  {moment(firstProducedBlockTimestamp).format(
                    translate("common.date_time.date_format").toString()
                  )}
                </span>
              )}
            </Cell>

            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.genesis_protocol_or_current_protocol"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
            >
              {genesisProtocolVersion && networkStats?.epochProtocolVersion && (
                <>
                  <span className="genesis-text">
                    v{genesisProtocolVersion}
                  </span>{" "}
                  / <span>v{networkStats.epochProtocolVersion}</span>
                </>
              )}
            </Cell>

            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.genesis_height"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
            >
              {networkStats && (
                <span className="genesis-text">
                  {networkStats.genesisHeight}
                </span>
              )}
            </Cell>
            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.epoch_length"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
            >
              {networkStats?.epochLength && (
                <span>{networkStats.epochLength}</span>
              )}
            </Cell>
          </InfoCard>

          <InfoCard className="protocol-config">
            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.genesis_total_supply"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
            >
              {genesisTotaSupply && (
                <span className="genesis-text">
                  <Balance
                    amount={totalGenesisSupply}
                    formulatedAmount={formatWithCommas(
                      genesisTotaSupply.toFixed(1)
                    )}
                    suffix={<span className="balance-suffix">M</span>}
                    label={<NearBadge />}
                    className="protocol-metric-value"
                  />
                </span>
              )}
            </Cell>

            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.accounts_in_genesis"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
            >
              {genesisAccountsAmount}
            </Cell>

            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.total_supply"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
            >
              {epochTotalSupply && (
                <Balance
                  amount={epochStartBlock!.totalSupply}
                  formulatedAmount={formatWithCommas(
                    epochTotalSupply.toFixed(1)
                  )}
                  suffix={<span className="balance-suffix">M</span>}
                  label={<NearBadge />}
                  className="protocol-metric-value"
                />
              )}
            </Cell>

            <Cell
              title={translate(
                "component.stats.ProtocolConfigInfo.live_accounts"
              )}
              cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
            >
              {liveAccountsCount}
            </Cell>
          </InfoCard>
          <style global jsx>{`
            .protocol-config {
              margin: 24px 0;
            }

            .genesis-text {
              color: #00c08b;
            }

            .protocol-metric-value {
              display: flex;
              align-items: center;
            }

            .balance-suffix {
              font-size: 25px;
              line-height: 35px;
              align-self: flex-end;
            }
          `}</style>
        </>
      )}
    </Translate>
  );
};

export default ProtocolConfigInfo;
