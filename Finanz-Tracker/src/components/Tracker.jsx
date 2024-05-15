import React, { useState } from "react";

const Tracker = () => {

  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const addTransaction = () => {
    if (description && amount) {
      setTransactions([
        ...transactions,
        { description, amount: parseFloat(amount) },
      ]);
      setDescription("");
      setAmount("");
    }
  };

  return (
    <>
      <h1>Finanz-Tracker</h1>
      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Betrag"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={addTransaction}>Hinzufügen</button>
      <h2>Transaktionen</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount}
          </li>
        ))}
      </ul>
    </>
  );
};
export default Tracker;
