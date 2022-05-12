import moment from "moment";
import JSBI from "jsbi";
import * as React from "react";

import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
import Balance, { formatWithCommas } from "../utils/Balance";
import NearBadge from "../nodes/NearBadge";

import { useTranslation } from "react-i18next";
import { useNetworkStats } from "../../hooks/subscriptions";
import { useEpochStartBlock } from "../../hooks/data";
import { useQuery, useQueryOrDefault } from "../../hooks/use-query";
import { styled } from "../../libraries/styles";
import * as BI from "../../libraries/bigint";

const ProtocolConfig = styled(InfoCard, {
  margin: "24px 0",
});

const GenesisText = styled("span", {
  color: "#00c08b",
});

const ProtocolMetricValue = styled(Balance, {
  display: "flex",
  alignItems: "center",
});

const BalanceSuffix = styled("span", {
  fontSize: 25,
  lineHeight: "35px",
  alignSelf: "flex-end",
});

const ProtocolConfigInfo: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const networkStats = useNetworkStats();
  const epochStartBlock = useEpochStartBlock();

  const { data: genesisAccountsAmount } = useQuery(
    "nearcore-genesis-accounts-count",
    []
  );
  const { data: genesisProtocolConfig } = useQuery(
    "nearcore-genesis-protocol-configuration",
    []
  );
  const { data: firstProducedBlockTimestamp } = useQuery(
    "first-produced-block-timestamp",
    []
  );

  const liveAccountsCount =
    useQueryOrDefault("live-accounts-count-aggregated-by-date", [], []) ?? [];
  const lastDateLiveAccounts = React.useMemo(
    () => liveAccountsCount[liveAccountsCount.length - 1]?.accountsCount,
    [liveAccountsCount]
  );

  let epochTotalSupply = epochStartBlock
    ? JSBI.toNumber(
        JSBI.divide(JSBI.BigInt(epochStartBlock.totalSupply), BI.nearNomination)
      ) /
      10 ** 6
    : null;

  const genesisTotalSupply = genesisProtocolConfig
    ? JSBI.toNumber(
        JSBI.divide(
          JSBI.BigInt(genesisProtocolConfig.header.total_supply),
          BI.nearNomination
        )
      ) /
      10 ** 6
    : null;

  return (
    <>
      <ProtocolConfig>
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
              <GenesisText>
                v{genesisProtocolConfig.header.latest_protocol_version}
              </GenesisText>{" "}
              / <span>v{networkStats.epochProtocolVersion}</span>
            </>
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_height")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {networkStats && (
            <GenesisText>{networkStats.genesisHeight}</GenesisText>
          )}
        </Cell>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.epoch_length")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {networkStats?.epochLength && <span>{networkStats.epochLength}</span>}
        </Cell>
      </ProtocolConfig>

      <ProtocolConfig>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisTotalSupply && genesisProtocolConfig && (
            <GenesisText>
              <ProtocolMetricValue
                amount={JSBI.BigInt(genesisProtocolConfig.header.total_supply)}
                formulatedAmount={formatWithCommas(
                  genesisTotalSupply.toFixed(1)
                )}
                suffix={<BalanceSuffix>M</BalanceSuffix>}
                label={<NearBadge />}
              />
            </GenesisText>
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
            <ProtocolMetricValue
              amount={epochStartBlock!.totalSupply}
              formulatedAmount={formatWithCommas(epochTotalSupply.toFixed(1))}
              suffix={<BalanceSuffix>M</BalanceSuffix>}
              label={<NearBadge />}
            />
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.live_accounts")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {lastDateLiveAccounts}
        </Cell>
      </ProtocolConfig>
    </>
  );
});

export default ProtocolConfigInfo;
