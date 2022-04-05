import * as React from "react";
import { styled } from "../../../libraries/styles";

import TransactionType from "./TransactionType";
// import Gas from "../../utils/Gas";

const Row = styled("div", {
  width: "100%",
  padding: 20,
  display: "flex",
  justifyContent: "space-between",
  background: "$textColor",
  boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
  borderRadius: 6,
});

const AccountInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});

const Divider = styled("div", {
  height: "100%",
  width: 1,
  marginHorizontal: "$space-m",
});

const AmountHeader = styled("div", {
  fontSize: "$font-s",
  color: "#616161",
});

const Amount = styled("div", {
  fontWeight: 600,
  fontSize: 20,
  lineHeight: "30px",
  color: "#000000",
  // color: "#0072CE",
});

const ActionRow = React.memo((props) => {
  return (
    <Row onClick={props.onClick}>
      <TransactionType actionKind={props.receipt.actions[0].kind} />
      <AccountInfo>
        <div>
          <AmountHeader>From</AmountHeader>
          <Amount>{props.receipt.signerId}</Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>To</AmountHeader>
          <Amount>{props.receipt.receiverId}</Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>Amount</AmountHeader>
          <Amount>0</Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>Fee</AmountHeader>
          <Amount>
            {/* <Gas gas={new BN(receipt.tokensBurnt) || 0} /> */}0
          </Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>Status</AmountHeader>
          <Amount>{Object.keys(props.receipt.status)[0]}</Amount>
        </div>
      </AccountInfo>
    </Row>
  );
});

export default ActionRow;
