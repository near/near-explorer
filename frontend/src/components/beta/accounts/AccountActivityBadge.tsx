import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { AccountActivityAction } from "../../../types/common";

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

  variants: {
    type: {
      transfer: {
        backgroundColor: "#F0FFEE",
      },
      refund: {
        backgroundColor: "#F0FFEE",
      },
      restake: {
        backgroundColor: "#EEFDFE",
      },
      "validator-reward": {
        backgroundColor: "#EEFDFE",
      },
      "contract-deployed": {
        backgroundColor: "#FFF2E4",
      },
      "access-key-created": {
        backgroundColor: "#ECF1FE",
      },
      "access-key-removed": {
        backgroundColor: "#FAF2F2",
      },
      "call-method": {
        backgroundColor: "#EEFAFF",
      },
      "account-created": {
        backgroundColor: "#F4FDDB",
      },
      "account-removed": {
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
    <Wrapper type={action.type}>
      {action.type === "call-method"
        ? action.methodName
        : t(`pages.account.activity.type.${action.type}`, {
            quantity:
              action.type === "batch" ? action.actions.length : undefined,
          })}
    </Wrapper>
  );
});

export default AccountActivityBadge;
