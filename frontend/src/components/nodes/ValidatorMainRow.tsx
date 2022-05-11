import BN from "bn.js";
import * as React from "react";

import { Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Balance from "../utils/Balance";
import { OrderTableCell, TableRow } from "../utils/Table";
import CountryFlag from "../utils/CountryFlag";
import CumulativeStakeChart from "./CumulativeStakeChart";
import { ValidatorPoolInfo } from "../../types/common";
import { styled } from "../../libraries/styles";

const ValidatorNodesText = styled(Col, {
  fontWeight: 500,
  fontSize: 14,
  color: "#3f4045",
});

const CollapseRowArrow = styled("td", {
  cursor: "pointer",
});

const StakeText = styled(ValidatorNodesText, {
  fontWeight: 700,
});

const ValidatorName = styled(Col, {
  maxWidth: 250,
  "@media (min-width: 1200px)": {
    maxWidth: 370,
  },
});

const ValidatorNameText = styled(ValidatorNodesText, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const PublicKey = styled(ValidatorNameText, {
  color: "#2b9af4",
});

const ValidatorsNodeLabel = styled(Col, {
  marginRight: 24,
  maxWidth: 138,
});

const IconCellIcon = styled("img", {
  width: 16,
});

interface Props {
  isRowActive: boolean;
  accountId: string;
  index: number;
  countryCode?: string;
  country?: string;
  publicKey?: string;
  poolInfo?: ValidatorPoolInfo;
  visibleStake?: string;
  stakeDelta?: BN;

  stakePercents: {
    ownPercent: number;
    cumulativePercent: number;
  } | null;
  handleClick: React.MouseEventHandler;
}

const yoctoNearToNear = new BN(1)
  .muln(10 ** 6)
  .muln(10 ** 6)
  .muln(10 ** 6)
  .muln(10 ** 6);

const ValidatorMainRow: React.FC<Props> = React.memo(
  ({
    isRowActive,
    accountId,
    index,
    countryCode,
    country,
    publicKey,
    poolInfo,
    visibleStake,
    stakeDelta,
    stakePercents,
    handleClick,
    children,
  }) => {
    const { t } = useTranslation();

    return (
      <TableRow className="mx-0" collapse={isRowActive} key={accountId}>
        <CollapseRowArrow onClick={handleClick}>
          <IconCellIcon
            src={
              isRowActive
                ? "/static/images/icon-minimize.svg"
                : "/static/images/icon-maximize.svg"
            }
          />
        </CollapseRowArrow>

        <OrderTableCell>{index}</OrderTableCell>
        <td>
          <CountryFlag
            id={`country_flag_${accountId}`}
            countryCode={countryCode}
            country={country}
          />
        </td>

        <td>
          <Row noGutters className="align-items-center">
            <ValidatorsNodeLabel>{children}</ValidatorsNodeLabel>

            <ValidatorName>
              <Row noGutters>
                <ValidatorNameText title={`@${accountId}`}>
                  {accountId}
                </ValidatorNameText>
              </Row>
              {publicKey && (
                <Row noGutters>
                  <PublicKey title={publicKey}>{publicKey}</PublicKey>
                </Row>
              )}
            </ValidatorName>
          </Row>
        </td>

        <td>
          {poolInfo === undefined ? (
            <Spinner animation="border" size="sm" />
          ) : poolInfo.fee === null ? (
            t("common.state.not_available")
          ) : (
            `${(
              (poolInfo.fee.numerator / poolInfo.fee.denominator) *
              100
            ).toFixed(0)}%`
          )}
        </td>
        <td>
          {poolInfo === undefined ? (
            <Spinner animation="border" size="sm" />
          ) : poolInfo.delegatorsCount === null ? (
            t("common.state.not_available")
          ) : (
            poolInfo.delegatorsCount
          )}
        </td>
        <StakeText as="td" className="text-right">
          {visibleStake ? (
            <Balance amount={visibleStake} label="NEAR" fracDigits={0} />
          ) : (
            "-"
          )}
          {stakeDelta && !stakeDelta.isZero() ? (
            <>
              <br />
              <small>
                {
                  <>
                    {!stakeDelta.isNeg() ? "+" : "-"}
                    {Number(stakeDelta.div(yoctoNearToNear)) < 1 ? (
                      <Balance
                        amount={stakeDelta.abs()}
                        label="NEAR"
                        fracDigits={4}
                      />
                    ) : (
                      <Balance
                        amount={stakeDelta.abs()}
                        label="NEAR"
                        fracDigits={0}
                      />
                    )}
                  </>
                }
              </small>
            </>
          ) : null}
        </StakeText>
        <td>
          <CumulativeStakeChart percents={stakePercents} />
        </td>
      </TableRow>
    );
  }
);

export default ValidatorMainRow;
