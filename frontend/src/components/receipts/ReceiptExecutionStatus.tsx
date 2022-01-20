import { ReceiptExecutionStatus } from "../../libraries/explorer-wamp/receipts";
import { useTranslation } from "react-i18next";

export interface Props {
  status: ReceiptExecutionStatus;
}
const ReceiptExecutionStatusComponent = ({ status }: Props) => {
  const { t } = useTranslation();
  // The "SuccessReceiptId" transaction execution status will be recursively deferred to the status of the receipt id,
  // but given we only care about the details when we display the whole transaction execution plan,
  // it is fine to just report the receipt status as "Succeeded"
  return <>{t(`common.receipts.status.${status}`)}</>;
};

export default ReceiptExecutionStatusComponent;
