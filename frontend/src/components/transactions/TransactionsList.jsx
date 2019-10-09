import ActionRow from "./ActionRow";

export default ({ transactions }) => {
  return (
    <>
      {transactions.flatMap((transaction, transactionIndex) =>
        transaction.actions
          .reverse()
          .map((action, actionIndex) => (
            <ActionRow
              key={transaction.hash + actionIndex}
              transaction={transaction}
              action={action}
              cls={`${
                transactions.length - 1 === transactionIndex &&
                transaction.actions.length - 1 === actionIndex
                  ? "transaction-row-bottom"
                  : ""
              }`}
            />
          ))
      )}
    </>
  );
};
