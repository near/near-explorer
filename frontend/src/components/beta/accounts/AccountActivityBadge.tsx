import * as React from "react";

import { useTranslation } from "next-i18next";

import { AccountActivityAction } from "@explorer/common/types/procedures";
import { styled } from "@explorer/frontend/libraries/styles";

type Props = {
  action: AccountActivityAction;
};

const Wrapper = styled("div", {
  paddingHorizontal: 10,
  minHeight: 30,
  borderRadius: 4,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  marginRight: 8,

  variants: {
    kind: {
      transfer: {
        backgroundColor: "#F0FFEE",
      },
      stake: {
        backgroundColor: "#EEFDFE",
      },
      validatorReward: {
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
        backgroundColor: "#F4FDDB",
      },
      deleteAccount: {
        backgroundColor: "#F9D6D9",
      },
      batch: {
        backgroundColor: "#E9E8E8",
      },
    },
  },
});

const AccountActivityBadge: React.FC<Props> = React.memo(({ action }) => {
  const { t } = useTranslation();
  return (
    <Wrapper kind={action.kind}>
      {t(`pages.account.activity.type.${action.kind}`, {
        quantity: action.kind === "batch" ? action.actions.length : undefined,
      })}
    </Wrapper>
  );
});

export default AccountActivityBadge;
