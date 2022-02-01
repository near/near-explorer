import moment from "moment";
import BN from "bn.js";
import React, { useCallback, useMemo } from "react";
import { utils } from "near-api-js";

import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
import Balance, { formatWithCommas } from "../utils/Balance";
import NearBadge from "../nodes/NearBadge";

import { useTranslation } from "react-i18next";
import { useNetworkStats } from "../../hooks/subscriptions";
import { useEpochStartBlock } from "../../hooks/data";
import { useWampQuery, useWampSimpleQuery } from "../../hooks/wamp";

const ProtocolConfigInfo = () => {
  const { t } = useTranslation();
  const networkStats = useNetworkStats();
  const epochStartBlock = useEpochStartBlock();

  const genesisAccountsAmount = useWampSimpleQuery(
    "nearcore-genesis-accounts-count",
    []
  );
  const genesisHeight = networkStats?.genesisHeight;
  const genesisProtocolConfig = useWampQuery(
    useCallback(
      async (wampCall) =>
        genesisHeight
          ? wampCall("nearcore-genesis-protocol-configuration", [genesisHeight])
          : undefined,
      [genesisHeight]
    )
  );
  const firstProducedBlockTimestamp = useWampSimpleQuery(
    "first-produced-block-timestamp",
    []
  );

  const liveAccountsCount =
    useWampSimpleQuery("live-accounts-count-aggregated-by-date", []) ?? [];
  const lastDateLiveAccounts = useMemo(
    () => liveAccountsCount[liveAccountsCount.length - 1]?.accountsCount,
    [liveAccountsCount]
  );

  let epochTotalSupply = epochStartBlock
    ? new BN(epochStartBlock.totalSupply.toString())
        .div(utils.format.NEAR_NOMINATION)
        .toNumber() /
      10 ** 6
    : null;

  const genesisTotalSupply = genesisProtocolConfig
    ? new BN(genesisProtocolConfig.header.total_supply)
        .div(utils.format.NEAR_NOMINATION)
        .toNumber() /
      10 ** 6
    : null;

  return (
    <>
      <InfoCard className="protocol-config">
        <Cell
          title={t("component.stats.ProtocolConfigInfo.first_produced_block")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {firstProducedBlockTimestamp && (
            <span>
              {moment(firstProducedBlockTimestamp).format(
                t("common.date_time.date_format")
              )}
            </span>
          )}
        </Cell>

        <Cell
          title={t(
            "component.stats.ProtocolConfigInfo.genesis_protocol_or_current_protocol"
          )}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          {genesisProtocolConfig && networkStats && (
            <>
              <span className="genesis-text">
                v{genesisProtocolConfig.header.latest_protocol_version}
              </span>{" "}
              / <span>v{networkStats.epochProtocolVersion}</span>
            </>
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_height")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {networkStats && (
            <span className="genesis-text">{networkStats.genesisHeight}</span>
          )}
        </Cell>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.epoch_length")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {networkStats?.epochLength && <span>{networkStats.epochLength}</span>}
        </Cell>
      </InfoCard>

      <InfoCard className="protocol-config">
        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisTotalSupply && genesisProtocolConfig && (
            <span className="genesis-text">
              <Balance
                amount={new BN(genesisProtocolConfig.header.total_supply)}
                formulatedAmount={formatWithCommas(
                  genesisTotalSupply.toFixed(1)
                )}
                suffix={<span className="balance-suffix">M</span>}
                label={<NearBadge />}
                className="protocol-metric-value"
              />
            </span>
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.accounts_in_genesis")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          {genesisAccountsAmount}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {epochTotalSupply && (
            <Balance
              amount={epochStartBlock!.totalSupply}
              formulatedAmount={formatWithCommas(epochTotalSupply.toFixed(1))}
              suffix={<span className="balance-suffix">M</span>}
              label={<NearBadge />}
              className="protocol-metric-value"
            />
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.live_accounts")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {lastDateLiveAccounts}
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
  );
};

export default ProtocolConfigInfo;
