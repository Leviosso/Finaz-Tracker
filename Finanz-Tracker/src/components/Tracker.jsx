import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, setTransactions } from "./store";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF4563",
  "#C71585",
  "#8A2BE2",
  "#A52A2A",
];

const Tracker = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    dispatch(setTransactions(savedTransactions));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = () => {
    if (description && amount) {
      dispatch(
        addTransaction({ description, amount: parseFloat(amount), type })
      );
      setDescription("");
      setAmount("");
      setType("expense"); // Reset to default type
    }
  };

  const getTotalAmount = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  };

  const filteredTransactions = transactions
    .filter((transaction) =>
      transaction.description.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    );

  const dataForPieChart = transactions.map((transaction, index) => ({
    name: transaction.description,
    value: transaction.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <>
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
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Ausgabe</option>
        <option value="income">Einnahme</option>
      </select>
      <button onClick={handleAddTransaction}>Hinzufügen</button>
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sortieren ({sortOrder === "asc" ? "Aufsteigend" : "Absteigend"})
      </button>
      <h2>Transaktionen</h2>
      <ul>
        {filteredTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount} € (
            {transaction.type === "income" ? "Einnahme" : "Ausgabe"})
            {transaction.description}: {transaction.amount} €
            {/* Button zum Löschen einer Transaktion */}
            <button className="delete" onClick={() => deleteTransaction(index)}>🗑️</button>
            {/* Button zum Öffnen des Modals zur Bearbeitung */}
            <button className="delete" onClick={() => openEditModal(index)}>✏️</button>
          </li>
        ))}
      </ul>
      <h3>Gesamtsaldo: {getTotalAmount()} €</h3>
      <h2>Verteilung der Ausgaben</h2>
      <PieChart width={500} height={500}>
        <Pie
          data={dataForPieChart}
          cx={250}
          cy={200}
          innerRadius={50}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          labelLine={true}
        >
          {dataForPieChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    

      {/* Modal für die Bearbeitung */}
      {selectedTransactionIndex !== null && (
        <div>
          <h3>{editOption === "amount" ? "Betrag" : "Beschreibung"} bearbeiten</h3>
          {/* Eingabefeld je nach ausgewählter Option */}
          {editOption === "amount" ? (
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          ) : (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
          {/* Button zum Speichern der Änderungen */}
          <button onClick={updateTransaction}>💾</button>
        </div>
      )}

      {/* Anzeige der Gesamtsumme */}
      <h3>Gesamtsumme: {getTotalAmount()} €</h3>
      </div>
    </>
  );
};

export default Tracker;
