import * as React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { shortenString } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";
import { AccountActivityAction } from "../../../types/common";
import CopyToClipboard from "../common/CopyToClipboard";

type Props = {
  action: AccountActivityAction;
  href?: string;
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
    as: {
      a: {
        cursor: "pointer",
      },
    },

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

const AccountActivityBadge: React.FC<Props> = React.memo(({ action, href }) => {
  const { t } = useTranslation();
  return (
    <Wrapper kind={action.kind} as={href ? "a" : undefined} href={href}>
      {action.kind === "functionCall" ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="methodName">{action.args.methodName}</Tooltip>}
        >
          <div style={{ display: "inline-flex" }}>
            {shortenString(action.args.methodName)}
            <div style={{ marginLeft: 16 }}>
              <CopyToClipboard text={action.args.methodName} />
            </div>
          </div>
        </OverlayTrigger>
      ) : (
        t(`pages.account.activity.type.${action.kind}`, {
          quantity: action.kind === "batch" ? action.actions.length : undefined,
        })
      )}
    </Wrapper>
  );
});

export default AccountActivityBadge;
