

import Tracker from "./components/Tracker";

import React, { useState, useEffect } from "react";

import "./App.css";

//Die App-Komponente wird in eine eigene Datei ausgelagert
const App = () => {

  return (
    <div>
      <Tracker />

  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  //Die Funktionen useEffect werden in eine eigene Funktion ausgelagert 
  useEffect(() => {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  //Die Funktion addTransaction wird in eine eigene Funktion ausgelagert
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

  //Die Berechnung der Gesamtsumme wird in eine eigene Funktion ausgelagert
  const getTotalAmount = () => {
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  //Die Filterung und Sortierung der Transaktionen wird in eine eigene Funktion ausgelagert
  const filteredTransactions = transactions
  .filter(transaction => transaction.description.toLowerCase().includes(filter.toLowerCase()))
  .sort((a, b) => sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount);

  return (
    <div>
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
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sortieren ({sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'})
      </button>
      <h2>Transaktionen</h2>
      <ul>
        {filteredTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount} €
          </li>
        ))}
      </ul>
      <h3>Gesamtausgaben: {getTotalAmount()} €</h3>

    </div>
  );
}

export default App;
