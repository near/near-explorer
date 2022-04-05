import BN from "bn.js";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { formatBytes, formatNear } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";

import ActionRow from "./ActionRow";
import ActionRowCollapsed from "./ActionRowCollapsed";

import TransactionType from "./TransactionType";
import Args from "../../transactions/ActionMessage";
import Gas from "../../utils/Gas";

type Props = {
  transaction: any;
};

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between",
  fontFamily: "Manrope",
});

const Action = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: "$textColor",
  boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
  borderRadius: 6,
  marginBottom: 0,

  "&:not(:first-child)": {
    margin: "10px 0",
  },

  "& > div:first-child": {
    zIndex: 1,
  },
});

// const DetailsHeader = styled("div", {
//   color: "#000000",
//   fontSize: "$font-m",
//   lineHeight: "28px",
//   fontWeight: 600
// });

// const ConsoleArgs = styled("div", {
//   background: "#abafb4",
//   borderRadius: 4,
//   color: "#3f4246",
// });

const TransactionContent: React.FC<Props> = React.memo((props) => {
  const [isRowActive, setRowActive] = React.useState(false);

  const switchRowActive = React.useCallback(() => setRowActive((x) => !x), [
    setRowActive,
  ]);

  return (
    <Wrapper>
      {props.transaction.receipts.map((receipt, index: number) => (
        <Action key={index}>
          <ActionRow onClick={switchRowActive} receipt={receipt} />

          <ActionRowCollapsed isRowActive={isRowActive} receipt={receipt} />
        </Action>
      ))}
    </Wrapper>
  );
});

export default TransactionContent;
