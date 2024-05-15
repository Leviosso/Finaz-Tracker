
import React, { useState, useEffect } from "react";
import "./Tracker.css";

const Tracker = () => {

  // Zustände für Transaktionen, Beschreibung, Betrag, Filter, Sortierreihenfolge,
  // ausgewählten Index der Transaktion und Bearbeitungsoption
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(null);
  const [editOption, setEditOption] = useState("amount"); // Option zum Bearbeiten: "amount" oder "description"

  // Effekt: Lädt Transaktionen aus dem localStorage beim Laden der Komponente
  useEffect(() => {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);
  }, []);

  // Effekt: Speichert Transaktionen im localStorage bei Änderungen
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Funktion zum Hinzufügen einer Transaktion
  const addTransaction = () => {

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction } from './store';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4563', '#C71585', '#8A2BE2', '#A52A2A'];

const Tracker = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleAddTransaction = () => {

    if (description && amount) {
      dispatch(addTransaction({ description, amount: parseFloat(amount) }));
      setDescription('');
      setAmount('');
    }
  };


  // Funktion zur Berechnung der Gesamtsumme
  const getTotalAmount = () => {
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  // Filterung und Sortierung der Transaktionen

  const getTotalAmount = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const filteredTransactions = transactions
    .filter(transaction => transaction.description.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount);


  // Funktion zum Löschen einer Transaktion
  const deleteTransaction = index => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  // Funktion zum Öffnen des Modals zur Bearbeitung
  const openEditModal = index => {
    setSelectedTransactionIndex(index);
    setAmount(transactions[index].amount); 
    setDescription(transactions[index].description);
  };

  // Funktion zum Aktualisieren einer Transaktion
  const updateTransaction = () => {
    if (editOption === "amount") {
      updateTransactionAmount();
    } else if (editOption === "description") {
      updateTransactionDescription();
    }
  };

  // Funktion zum Aktualisieren des Betrags einer Transaktion
  const updateTransactionAmount = () => {
    if (amount && selectedTransactionIndex !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[selectedTransactionIndex].amount = parseFloat(amount);
      setTransactions(updatedTransactions);
      setSelectedTransactionIndex(null); 
      setAmount(""); 
    }
  };

  // Funktion zum Aktualisieren der Beschreibung einer Transaktion
  const updateTransactionDescription = () => {
    if (description && selectedTransactionIndex !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[selectedTransactionIndex].description = description;
      setTransactions(updatedTransactions);
      setSelectedTransactionIndex(null); 
      setDescription(""); 
    }
  };

  return (
    <>
    <div className="track">

  const dataForPieChart = transactions.map((transaction, index) => ({
    name: transaction.description,
    value: transaction.amount,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div>

      <h1>Finanz-Tracker</h1>
      {/* Eingabefeld für die Beschreibung */}
      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* Eingabefeld für den Betrag */}
      <input
        type="number"
        placeholder="Betrag"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Button zum Hinzufügen einer Transaktion */}
      <button onClick={addTransaction}>Hinzufügen</button>
      {/* Eingabefeld für den Filter */}

      <button onClick={handleAddTransaction}>Hinzufügen</button>

      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {/* Button zum Ändern der Sortierreihenfolge */}
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sortieren ({sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'})
      </button>


      {/* Dropdown-Menü zur Auswahl des Bearbeitungsoptionen */}
      <select value={editOption} onChange={(e) => setEditOption(e.target.value)}>
        <option value="amount">Betrag bearbeiten</option>
        <option value="description">Beschreibung bearbeiten</option>
      </select>

      <h2>Transaktionen</h2>
      <ul>
        {/* Mapping der gefilterten und sortierten Transaktionen */}
        {filteredTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount} €
            {/* Button zum Löschen einer Transaktion */}
            <button onClick={() => deleteTransaction(index)}>🗑️</button>
            {/* Button zum Öffnen des Modals zur Bearbeitung */}
            <button onClick={() => openEditModal(index)}>✏️</button>
          </li>
        ))}
      </ul>

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
      <h3>Gesamtausgaben: {getTotalAmount()} €</h3>
      </div>
    </>

      <h2>Transaktionen</h2>
      <ul>
        {filteredTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount} €
          </li>
        ))}
      </ul>
      <h3>Gesamtausgaben: {getTotalAmount()} €</h3>
      <h2>Verteilung der Ausgaben</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={dataForPieChart}
          cx={200}
          cy={200}
          innerRadius={50}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}€`}
          labelLine={true}
        >
          {dataForPieChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>

  );
};

export default Tracker;


