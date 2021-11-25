import { PureComponent } from "react";
import { Table } from "react-bootstrap";
import AccountsApi from "../../libraries/explorer-wamp/accounts";
import Balance from "../utils/Balance";

interface Props {
  accountId: string;
}
interface State {
  accountActivity?: object[];
}

class ActivityList extends PureComponent<Props> {
  state: State = {};

  fetchAccountActivities = (accountId: string) => {
    new AccountsApi()
      .getAccountActivity(accountId)
      .then((accountActivity) => {
        this.setState({ accountActivity });
      })
      .catch((error) => {
        throw error;
      });
  };

  componentDidMount() {
    this.fetchAccountActivities(this.props.accountId);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.accountId !== this.props.accountId) {
      this.fetchAccountActivities(this.props.accountId);
    }
  }

  render() {
    const { accountActivity } = this.state;
    if (!accountActivity) {
      return null;
    }

    if (this.props)
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
            {accountActivity.map((activity: any, index: number) => (
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
            ))}
          </tbody>
        </Table>
      );
  }
}

export default ActivityList;
