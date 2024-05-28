import React from "react";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onDeleteTransaction, onOpenEditModal }) => {
  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/api/transactions/${id}`, { // Add the correct URL
      method: 'DELETE',
    });

    if (response.ok) {
      onDeleteTransaction(id);
    }
  };

  return (
    <ul>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={() => handleDelete(transaction.id)}
          onEdit={() => onOpenEditModal(transaction.id)}
        />
      ))}
    </ul>
  );
};

export default TransactionList;

