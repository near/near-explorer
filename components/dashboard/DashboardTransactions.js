import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import DashboardTransactionsRow from "./DashboardTransactionsRow";

const EmptyRow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

const DashboardTransactions = () => (
  <div>
    <EmptyRow />
    <Row noGutters="true">
      <Col className="dashboard-transactions-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="#CCC"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M7 19h18M7 25l-6-6 6-6M19 7H1M19 1l6 6-6 6" />
          </g>
        </svg>
        &nbsp; Recent Transactions
      </Col>
    </Row>
    <EmptyRow />
    <DashboardTransactionsRow
      txType="Call"
      txMsg="transfer {to: 'bob.near', tokens: '1000'}"
      txId="1234567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Sent"
      txMsg="125 N to @jake.near"
      txId="21234567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Call"
      txMsg="transfer {to: 'bob.near', tokens: '1000'}"
      txId="1234567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Staked"
      txMsg="10 tokens MlGfMAO..."
      txId="454567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="ContractDeployed"
      txMsg="NameOfContract"
      txId="4522267890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Call"
      txMsg="transfer {to: 'bob.near', tokens: '1000'}"
      txId="1234567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Call"
      txMsg="transfer {to: 'bob.near', tokens: '1000'}"
      txId="1234567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Staked"
      txMsg="10 tokens MlGfMAO..."
      txId="454567890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="ContractDeployed"
      txMsg="NameOfContract"
      txId="4522267890"
      contractName="NameOfContract"
      username="username"
    />
    <DashboardTransactionsRow
      txType="Call"
      txMsg="transfer {to: 'bob.near', tokens: '1000'}"
      txId="1234567890"
      contractName="NameOfContract"
      username="username"
    />
    <style jsx global>{`
      .dashboard-transactions-title {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </div>
);

export default DashboardTransactions;
