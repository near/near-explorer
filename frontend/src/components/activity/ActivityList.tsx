import { PureComponent } from "react";
import { Table } from "react-bootstrap";
import AccountsApi from "../../libraries/explorer-wamp/accounts";
import Balance from "../utils/Balance";

interface Props {
  accountId: string;
  extended: boolean;
}
interface State {
  accountActivity?: object[];
}

class ActivityList extends PureComponent<Props> {
  static defaultProps = {
    extended: false,
  };
  state: State = {};

  fetchAccountActivities = (accountId: string, extended: boolean) => {
    if (!extended) {
      new AccountsApi()
        .getAccountActivity(accountId)
        .then((accountActivity) => {
          this.setState({ accountActivity });
        })
        .catch((error) => {
          throw error;
        });
    } else {
      new AccountsApi()
        .getExtendedAccountActivity(accountId)
        .then((accountActivity) => {
          this.setState({ accountActivity });
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  componentDidMount() {
    this.fetchAccountActivities(this.props.accountId, this.props.extended);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.accountId !== this.props.accountId) {
      this.fetchAccountActivities(this.props.accountId, this.props.extended);
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
            {accountActivity.map((activity: any) => (
              <tr key={activity.receiptId}>
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
