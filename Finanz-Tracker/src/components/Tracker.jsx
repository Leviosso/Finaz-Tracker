import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, setTransactions } from "./store";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Tracker.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF4563",
  "#C71585",
  "#8A2BE2",
  "#A52A2A",
  "#7FFF00",
  "#FFD700",
  "#FF8C00",
  "#FF1493",
];

const categories = [
  { icon: "🚗", name: "Auto" },
  { icon: "🛢️", name: "Gas" },
  { icon: "⚡", name: "Strom" },
  { icon: "🏠", name: "Miete" },
  { icon: "🍲", name: "Essen" },
  { icon: "🎲", name: "Unterhaltung" },
  { icon: "🛍️", name: "Kleidung" },
  { icon: "💶", name: "Gehalt" },
  { icon: "📈", name: "Zinsen" },
  { icon: "🎁", name: "Geschenke" },
  { icon: "📚", name: "Bildung" },
  { icon: "🏥", name: "Gesundheit" },
  { icon: "📱", name: "Telefon" },
  { icon: "🎫", name: "Tickets" },
  { icon: "🚁", name: "Flug" },
  { icon: "📦", name: "Sonstiges" },
];

const Tracker = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTransactionIndex, setSelectedTransactionIndex] =
    useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    dispatch(setTransactions(savedTransactions));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = () => {
    if (amount && category && date) {
      dispatch(
        addTransaction({
          description,
          amount: parseFloat(amount),
          type,
          category,
          date,
        })
      );
      setDescription("");
      setAmount("");
      setCategory("");
      setDate("");
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

  const getIncomeTotal = () => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getExpenseTotal = () => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.category &&
        transaction.category.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    );

  const deleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    dispatch(setTransactions(updatedTransactions));
  };

  const openEditModal = (index) => {
    setSelectedTransactionIndex(index);
    const selectedTransaction = transactions[index];
    setEditDescription(selectedTransaction.description);
    setEditAmount(selectedTransaction.amount);
    setEditCategory(selectedTransaction.category);
    setEditDate(selectedTransaction.date);
  };

  const updateTransaction = () => {
    const updatedTransactions = [...transactions];
    updatedTransactions[selectedTransactionIndex] = {
      ...updatedTransactions[selectedTransactionIndex],
      description: editDescription,
      amount: parseFloat(editAmount),
      category: editCategory,
      date: editDate,
    };
    dispatch(setTransactions(updatedTransactions));
    setSelectedTransactionIndex(null);
    setEditDescription("");
    setEditAmount("");
    setEditCategory("");
    setEditDate("");
  };

  const dataForPieChart = transactions.map((transaction, index) => ({
    name: transaction.category,
    value: transaction.amount,
    color: COLORS[index % COLORS.length],
  }));

  const incomeTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === "income"
  );
  const expenseTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalIncome = getIncomeTotal();
  const totalExpenses = getExpenseTotal();
  const balance = totalIncome - totalExpenses;

  return (
    <div className="track">
      <h1>Finanz-Tracker</h1>
      <input
        type="text"
        placeholder="Beschreibung (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Betrag"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        placeholder="Datum"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Ausgabe</option>
        <option value="income">Einnahme</option>
      </select>
      <button onClick={() => setShowCategories(!showCategories)}>
        {showCategories ? "Kategorien ausblenden" : "Kategorien wählen"}
      </button>
      {showCategories && (
        <div>
          {categories.map((cat, index) => (
            <button
              key={index}
              title={`${cat.name}`}
              onClick={() => setCategory(cat.icon)}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

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
            {transaction.date} - {transaction.category}:{" "}
            {transaction.description || "Keine Beschreibung"}:{" "}
            {transaction.amount} € (
            {transaction.type === "income" ? "Einnahme" : "Ausgabe"})
            <button className="delete" onClick={() => deleteTransaction(index)}>
              🗑️
            </button>
            <button className="edit" onClick={() => openEditModal(index)}>
              ✏️
            </button>
          </li>
        ))}
      </ul>
      <div className="details">
        <h3>Gesamtsaldo: {getTotalAmount()} €</h3>
        <h3>Gesamteinnahmen: {totalIncome} €</h3>
        <h3>Gesamtausgaben: {totalExpenses} €</h3>
        <h3>Saldo (Einnahmen - Ausgaben): {balance} €</h3>
        <h2>Verteilung der Ausgaben</h2>
        <PieChart width={500} height={500}>
          <Pie
            data={dataForPieChart}
            cx={250}
            cy={210}
            innerRadius={60}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={10}
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
      </div>
      <h2>Einnahmen</h2>
      <ul>
        {incomeTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.date} - {transaction.category}:{" "}
            {transaction.description || "Keine Beschreibung"}:{" "}
            {transaction.amount} €
          </li>
        ))}
      </ul>

      <h2>Ausgaben</h2>
      <ul>
        {expenseTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.date} - {transaction.category}:{" "}
            {transaction.description || "Keine Beschreibung"}:{" "}
            {transaction.amount} €
          </li>
        ))}
      </ul>

      {selectedTransactionIndex !== null && (
        <div>
          <h3>Transaktion bearbeiten</h3>
          <input
            type="text"
            placeholder="Beschreibung"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Betrag"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />
          <input
            type="date"
            placeholder="Datum"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <div className="categories">
            {categories.map((cat, index) => (
              <button key={index} onClick={() => setEditCategory(cat.icon)}>
                {cat.icon}
              </button>
            ))}
          </div>
          <button onClick={updateTransaction}>Speichern</button>
        </div>
      )}
    </div>
  );
};

export default Tracker;
