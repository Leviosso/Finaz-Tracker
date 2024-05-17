import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, setTransactions } from "./store/transactionsSlice";
import AddTransactionForm from "./components/AddTransactionForm";
import EditTransactionModal from "./components/EditTransactionModal";
import TransactionList from "./components/TransactionList";
import PieChartComponent from "./components/PieChartComponent";
import "./styles/Tracker.css";

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
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    dispatch(setTransactions(savedTransactions));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction) => {
    transaction.id = new Date().toISOString(); // Assign a unique ID based on the current timestamp
    dispatch(addTransaction(transaction));
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

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    dispatch(setTransactions(updatedTransactions));
  };

  const openEditModal = (id) => {
    setSelectedTransactionId(id);
    const selectedTransaction = transactions.find((transaction) => transaction.id === id);
    if (selectedTransaction) {
      setEditDescription(selectedTransaction.description);
      setEditAmount(selectedTransaction.amount);
      setEditCategory(selectedTransaction.category);
      setEditDate(selectedTransaction.date);
    }
  };

  const updateTransaction = () => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === selectedTransactionId
        ? { ...transaction, description: editDescription, amount: parseFloat(editAmount), category: editCategory, date: editDate }
        : transaction
    );
    dispatch(setTransactions(updatedTransactions));
    setSelectedTransactionId(null);
    setEditDescription("");
    setEditAmount("");
    setEditCategory("");
    setEditDate("");
  };

  const incomeTransactions = filteredTransactions.filter((transaction) => transaction.type === "income");
  const expenseTransactions = filteredTransactions.filter((transaction) => transaction.type === "expense");

  const totalIncome = getIncomeTotal();
  const totalExpenses = getExpenseTotal();
  const balance = totalIncome - totalExpenses;

  return (
    <div className="track">
      <h1>Finanz-Tracker</h1>
      <AddTransactionForm onAddTransaction={handleAddTransaction} categories={categories} />
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
        Sortieren ({sortOrder === "asc" ? "Aufsteigend" : "Absteigend"})
      </button>
      <h2>Transaktionen</h2>
      <TransactionList
        transactions={filteredTransactions}
        onDeleteTransaction={deleteTransaction}
        onOpenEditModal={openEditModal}
      />
      <div className="details">
        <h3>Gesamtsaldo: {getTotalAmount()} €</h3>
        <h3>Gesamteinnahmen: {totalIncome} €</h3>
        <h3>Gesamtausgaben: {totalExpenses} €</h3>
        <h3>Saldo (Einnahmen - Ausgaben): {balance} €</h3>
        <h2>Verteilung der Ausgaben</h2>
        <PieChartComponent transactions={transactions} />
      </div>
      <h2>Einnahmen</h2>
      <ul>
        {incomeTransactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.category}: {transaction.description || "Keine Beschreibung"}: {transaction.amount} €
          </li>
        ))}
      </ul>
      <h2>Ausgaben</h2>
      <ul>
        {expenseTransactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.category}: {transaction.description || "Keine Beschreibung"}: {transaction.amount} €
          </li>
        ))}
      </ul>
      {selectedTransactionId !== null && (
        <EditTransactionModal
          selectedTransactionId={selectedTransactionId}
          categories={categories}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          editAmount={editAmount}
          setEditAmount={setEditAmount}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          editDate={editDate}
          setEditDate={setEditDate}
          onUpdateTransaction={updateTransaction}
        />
      )}
    </div>
  );
};

export default Tracker;
