import React from "react";

const TransactionItem = ({
  transaction,
  onDeleteTransaction,
  onOpenEditModal,
}) => {
  return (
    <li>
      {transaction.date} - {transaction.category}:{" "}
      {transaction.description || "Keine Beschreibung"}: {transaction.amount} € (
      {transaction.type === "income" ? "Einnahme" : "Ausgabe"})
      <button className="delete" onClick={() => onDeleteTransaction(transaction.id)}>
        🗑️
      </button>
      <button className="edit" onClick={() => onOpenEditModal(transaction.id)}>
        ✏️
      </button>
    </li>
  );
};

export default TransactionItem;
