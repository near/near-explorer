import * as React from "react";

import { useTranslation } from "react-i18next";

import { Action } from "@explorer/common/types/procedures";
import CodeArgs from "@explorer/frontend/components/beta/common/CodeArgs";
import { NearAmount } from "@explorer/frontend/components/utils/NearAmount";
import { styled } from "@explorer/frontend/libraries/styles";

interface Props {
  action: Action;
  onClick: React.MouseEventHandler;
  isTxTypeActive: boolean;
}

const Wrapper = styled("div", {
  alignItems: "center",
  marginVertical: 10,
  userSelect: "none",
});

const ActionType = styled("div", {
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginRight: 13,
  minWidth: 60,
  minHeight: 25,
  borderRadius: 4,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  lineHeight: "21px",
  transition: "all .15s ease-in-out",
  cursor: "pointer",

  "&:hover": {
    color: "#fff",
    backgroundColor: "#1E93FF",
  },

  variants: {
    kind: {
      transfer: {
        backgroundColor: "#F0FFF5",
      },
      stake: {
        backgroundColor: "#EEFDFE",
      },
      deployContract: {
        backgroundColor: "#FFF2E4",
      },
      addKey: {
        backgroundColor: "#ECF1FE",
      },
      deleteKey: {
        backgroundColor: "#FAF2F2",
      },
      functionCall: {
        backgroundColor: "#EEFAFF",
      },
      createAccount: {
        backgroundColor: "#FEF3FF",
      },
      deleteAccount: {
        backgroundColor: "#FAF2F2",
      },
    },
  },
});

const Description = styled("div", {
  display: "inline-flex",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "150%",

  "& span": {
    fontWeight: 600,
  },
});

const ArgsWrapper = styled("div", {
  padding: "10px 0",
  marginLeft: 25,
});

const ExpandSign = styled("span", {
  marginLeft: 8,
});

const ReceiptKind: React.FC<Props> = React.memo(
  ({ action, onClick, isTxTypeActive }) => {
    const { t } = useTranslation();

    return (
      <Wrapper>
        <ActionType kind={action.kind} onClick={onClick}>
          {t(`pages.transaction.type.${action.kind}`)}
          {action.kind === "functionCall" ? (
            <Description>{`'${action.args.methodName}'`}</Description>
          ) : null}
          <ExpandSign>{isTxTypeActive ? "-" : "+"}</ExpandSign>
        </ActionType>
        {action.kind === "transfer" ? (
          <Description>
            <span>
              <NearAmount amount={action.args.deposit} decimalPlaces={2} />
            </span>
          </Description>
        ) : null}

        {action.kind === "functionCall" && isTxTypeActive ? (
          <ArgsWrapper>
            <CodeArgs args={action.args.args} />
          </ArgsWrapper>
        ) : null}
      </Wrapper>
    );
  }
);

export default ReceiptKind;
