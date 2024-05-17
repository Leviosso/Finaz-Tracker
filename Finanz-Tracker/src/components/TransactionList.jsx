import React from "react";
import TransactionItem from "./TransactionItem";

const TransactionList = ({
  transactions,
  onDeleteTransaction,
  onOpenEditModal,
}) => {
  return (
    <ul>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDeleteTransaction={onDeleteTransaction}
          onOpenEditModal={onOpenEditModal}
        />
      ))}
    </ul>
  );
};

export default TransactionList;
