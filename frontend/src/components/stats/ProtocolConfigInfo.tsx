import moment from "moment";
import BN from "bn.js";
import React, { useEffect, useState, useContext } from "react";

import StatsApi from "../../libraries/explorer-wamp/stats";
import { NetworkStatsContext } from "../../context/NetworkStatsProvider";

import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
import Balance, { formatWithCommas } from "../utils/Balance";
import NearBadge from "../nodes/NearBadge";

const ProtocolConfigInfo = () => {
  const [totalGenesisSupply, setTotalGenesisSupply] = useState<BN>();
  const [
    genesisProtocolVersion,
    setGenesisProtocolVersion,
  ] = useState<number>();
  const [liveAccountsCount, setLiveAccountsCount] = useState<number>();
  const [genesisAccountsAmount, setGenesisAccountsAmount] = useState<number>();

  const { networkStats, epochStartBlock } = useContext(NetworkStatsContext);

  let epochTotalSupply = epochStartBlock?.totalSupply
    ? new BN(epochStartBlock.totalSupply.toString())
        .div(new BN((10 ** 20).toString()))
        .div(new BN((10 ** 4).toString()))
        .toNumber() /
      10 ** 6
    : null;

  const genesisTotaSupply = totalGenesisSupply
    ? new BN(totalGenesisSupply.toString())
        .div(new BN((10 ** 20).toString()))
        .div(new BN((10 ** 4).toString()))
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
  }, []);

  return (
    <>
      <InfoCard className="protocol-config">
        <Cell
          title="Genesis Started"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {networkStats?.genesisTime && (
            <>
              <span>
                {moment(networkStats?.genesisTime).format("MMMM DD, YYYY")}
              </span>
              <div style={{ fontSize: "10px", lineHeight: "1" }}>
                {moment(networkStats?.genesisTime).format("[at] h:mm:ssa")}
              </div>
            </>
          )}
        </Cell>

        <Cell
          title="Genesis Protocol / Current Protocol"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          {genesisProtocolVersion && networkStats?.epochProtocolVersion && (
            <>
              <span className="genesis-text">v{genesisProtocolVersion}</span> /{" "}
              <span>v{networkStats.epochProtocolVersion}</span>
            </>
          )}
        </Cell>

        <Cell
          title="Genesis Height"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {networkStats && (
            <span className="genesis-text">{networkStats.genesisHeight}</span>
          )}
        </Cell>
        <Cell
          title="Epoch Length"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {networkStats?.epochLength && <span>{networkStats.epochLength}</span>}
        </Cell>
      </InfoCard>

      <InfoCard className="protocol-config">
        <Cell
          title="Genesis Total Supply"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisTotaSupply && (
            <span className="genesis-text">
              <Balance
                amount={totalGenesisSupply}
                formulatedAmount={formatWithCommas(
                  genesisTotaSupply.toFixed(1)
                )}
                label={
                  <>
                    <span className="balance-suffix">M</span>
                    <NearBadge />
                  </>
                }
                className="protocol-metric-value"
              />
            </span>
          )}
        </Cell>

        <Cell
          title="Accounts in Genesis"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          {genesisAccountsAmount}
        </Cell>

        <Cell
          title="Total Supply"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {epochTotalSupply && (
            <Balance
              amount={epochStartBlock!.totalSupply}
              formulatedAmount={formatWithCommas(epochTotalSupply.toFixed(1))}
              label={
                <>
                  <span className="balance-suffix">M</span>
                  <NearBadge />
                </>
              }
              className="protocol-metric-value"
            />
          )}
        </Cell>

        <Cell
          title="Live Accounts"
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

        .near-badge {
          margin-left: 10px;
        }
        .balance-suffix {
          font-size: 25px;
          line-height: 35px;
          align-self: flex-end;
        }
      `}</style>
    </>
  );
};

export default ProtocolConfigInfo;
