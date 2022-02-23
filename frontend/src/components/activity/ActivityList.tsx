import { FC } from "react";
import { Table } from "react-bootstrap";

import { useWampSimpleQuery } from "../../hooks/wamp";
import Balance from "../utils/Balance";

interface Props {
  accountId: string;
}

const ActivityList: FC<Props> = ({ accountId }) => {
  const accountActivity =
    useWampSimpleQuery("account-activity", [accountId]) ?? [];

  return (
    <Table responsive>
      <thead>
        <tr style={{ textTransform: "uppercase" }}>
          <th>From</th>
          <th>To</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {accountActivity.length > 0 ? (
          accountActivity.map((activity: any, index: number) => (
            <tr key={`${activity.timestamp}_${index}`}>
              <td>{activity.signerId}</td>
              <td>{activity.receiverId}</td>
              <td>{activity.action.kind}</td>
              <td>
                {activity.nonstakedBalance ? (
                  <Balance amount={activity.nonstakedBalance} />
                ) : (
                  "-"
                )}
              </td>
              <td>{activity.timestamp}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>There is no data</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ActivityList;
