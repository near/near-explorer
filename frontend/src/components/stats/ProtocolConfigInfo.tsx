import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { Spinner } from "react-bootstrap";

import NearBadge from "@explorer/frontend/components/nodes/NearBadge";
import Balance, {
  formatWithCommas,
} from "@explorer/frontend/components/utils/Balance";
import {
  InfoCard,
  InfoCardCell as Cell,
} from "@explorer/frontend/components/utils/InfoCard";
import { useDateFormat } from "@explorer/frontend/hooks/use-date-format";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import * as BI from "@explorer/frontend/libraries/bigint";
import { styled } from "@explorer/frontend/libraries/styles";

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
  const epochStartBlockSub = useSubscription(["epochStartBlock"]);
  const protocolConfigSub = useSubscription(["protocolConfig"]);

  const genesisConfigSub = useSubscription(["genesisConfig"]);

  const lastAccountsHistorySub = useSubscription([
    "accountsHistory",
    { amountOfDays: 1 },
  ]);
  const lastDateLiveAccountsCount =
    lastAccountsHistorySub.data?.liveAccounts[0]?.[1];

  const epochTotalSupply = React.useMemo(() => {
    if (!epochStartBlockSub.data) {
      return null;
    }
    return {
      amount: epochStartBlockSub.data.totalSupply,
      formulatedAmount: formatWithCommas(
        (
          JSBI.toNumber(
            JSBI.divide(
              JSBI.BigInt(epochStartBlockSub.data.totalSupply),
              BI.nearNomination
            )
          ) /
          10 ** 6
        ).toFixed(1)
      ),
    };
  }, [epochStartBlockSub.data]);

  const format = useDateFormat();

  return (
    <>
      <ProtocolConfig>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.first_produced_block")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisConfigSub.status === "success" && (
            <span>
              {format(
                genesisConfigSub.data.timestamp,
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
          {genesisConfigSub.status === "success" &&
            protocolConfigSub.status === "success" && (
              <>
                <GenesisText>
                  v{genesisConfigSub.data.protocolVersion}
                </GenesisText>{" "}
                / <span>v{protocolConfigSub.data.version}</span>
              </>
            )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_height")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisConfigSub.status === "success" && (
            <GenesisText>{genesisConfigSub.data.height}</GenesisText>
          )}
        </Cell>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.epoch_length")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {protocolConfigSub.status === "success" && (
            <span>{protocolConfigSub.data.epochLength}</span>
          )}
        </Cell>
      </ProtocolConfig>

      <ProtocolConfig>
        <Cell
          title={t("component.stats.ProtocolConfigInfo.genesis_total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisConfigSub.status === "success" && (
            <GenesisText>
              <ProtocolMetricValue
                amount={JSBI.BigInt(genesisConfigSub.data.totalSupply)}
                formulatedAmount={formatWithCommas(
                  (
                    JSBI.toNumber(
                      JSBI.divide(
                        JSBI.BigInt(genesisConfigSub.data.totalSupply),
                        BI.nearNomination
                      )
                    ) /
                    10 ** 6
                  ).toFixed(1)
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
          {genesisConfigSub.data?.accountCount ?? (
            <Spinner animation="border" variant="secondary" />
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {epochTotalSupply && (
            <ProtocolMetricValue
              amount={epochTotalSupply.amount}
              formulatedAmount={epochTotalSupply.formulatedAmount}
              suffix={<BalanceSuffix>M</BalanceSuffix>}
              label={<NearBadge />}
            />
          )}
        </Cell>

        <Cell
          title={t("component.stats.ProtocolConfigInfo.live_accounts")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {lastDateLiveAccountsCount}
        </Cell>
      </ProtocolConfig>
    </>
  );
});

export default ProtocolConfigInfo;
