import * as T from "../../libraries/explorer-wamp/transactions";
import { Row, Col } from "react-bootstrap";
import ReceiptOutcomeRow from "./ReceiptOutcomeRow";

import { displayArgs } from "./ActionMessage";

export interface Props {
  receipts: T.ReceiptsOutcomeList[];
}

export default ({ receipts }: Props) => {
  const listData = function () {
    const receiptsObj = receipts.reduce(
      (obj, receiptItem) => ({
        ...obj,
        [receiptItem.receipt_id]: {
          ...receiptItem,
          producedReceipts: receiptItem.produced_receipt_id
            ? receipts
                .map((item) =>
                  receiptItem.receipt_id === item.receipt_id &&
                  item.produced_receipt_id
                    ? obj[item.produced_receipt_id]
                    : undefined
                )
                .filter((i) => i !== undefined)
            : [],
          actions: receipts
            .map((actionItem) => ({
              receipt_id: actionItem.receipt_id,
              produced_receipt_id: actionItem.produced_receipt_id,
              action_kind: actionItem.action_kind,
              args: actionItem.args,
            }))
            .filter(
              (actionItem) =>
                receiptItem.receipt_id === actionItem.receipt_id &&
                receiptItem.produced_receipt_id ===
                  actionItem.produced_receipt_id
            ),
        },
      }),
      {}
    );

    const parseReceipt = receiptsObj[receipts[0].converted_into_receipt_id];

    const parseProducedReceipts = {
      ...parseReceipt,
      producedReceipts: parseReceipt.producedReceipts?.filter(
        (
          i: T.ReceiptsOutcomeList,
          index: number,
          array: T.ReceiptsOutcomeList[]
        ) => array.map((i) => i.receipt_id).indexOf(i.receipt_id) === index
      ),
    };

    return parseProducedReceipts;
  };

  const receiptsList = listData();

  console.log("receiptsList", receiptsList);

  return (
    <>
      <Row noGutters>
        <Col>
          <Row noGutters>
            <Col>Receipt ID:</Col>
            <Col>{receiptsList.receipt_id}</Col>
          </Row>

          <Row noGutters>
            <Col>Receipt Kind:</Col>
            <Col>{receiptsList.receipt_kind}</Col>
          </Row>

          <Row noGutters>
            <Col>Status:</Col>
            <Col>{receiptsList.status}</Col>
          </Row>

          {receiptsList?.actions && (
            <>
              <Row noGutters className="mx-0">
                <Col>Actions:</Col>
              </Row>
              {receiptsList.actions.map(
                (item: T.ReceiptsOutcomeList, index: number) => (
                  <Row
                    key={`${item.receipt_id}_${index}`}
                    noGutters
                    className="pl-4"
                  >
                    <Col>
                      <Row noGutters>
                        <Col>Action:</Col>
                        <Col>{item.action_kind}</Col>
                      </Row>

                      <Row noGutters>
                        <Col>Args:</Col>
                        <Col>
                          <pre>{JSON.stringify(item.args)}</pre>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              )}
            </>
          )}

          {receiptsList?.args?.args_base64 && (
            <Row noGutters>
              <Col>
                <dl>
                  <dt>Arguments:</dt>
                  <dd>{displayArgs(receiptsList.args.args_base64)}</dd>
                </dl>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {receiptsList.producedReceipts?.map((receipt: T.ReceiptsOutcomeList) => (
        <ReceiptOutcomeRow key={receipt.receipt_id} receipt={receipt} />
      ))}
    </>
  );
};
