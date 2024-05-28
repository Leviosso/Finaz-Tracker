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
    const fetchTransactions = async () => {
      const response = await fetch('http://localhost:5000/api/transactions');
      if (response.ok) {
        const data = await response.json();
        dispatch(setTransactions(data));
      } else {
        console.error('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [dispatch]);

  const handleAddTransaction = async (transaction) => {
    const response = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (response.ok) {
      const newTransaction = await response.json();
      dispatch(addTransaction(newTransaction));
    } else {
      console.error('Failed to add transaction');
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

  const deleteTransaction = async (id) => {
    const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(setTransactions(transactions.filter((transaction) => transaction.id !== id)));
    } else {
      console.error('Failed to delete transaction');
    }
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

  const updateTransaction = async () => {
    const updatedTransaction = {
      id: selectedTransactionId,
      description: editDescription,
      amount: parseFloat(editAmount),
      category: editCategory,
      date: editDate,
      type: transactions.find(t => t.id === selectedTransactionId).type
    };

    const response = await fetch(`http://localhost:5000/api/transactions/${selectedTransactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTransaction),
    });

    if (response.ok) {
      dispatch(setTransactions(transactions.map((transaction) =>
        transaction.id === selectedTransactionId ? updatedTransaction : transaction
      )));
      setSelectedTransactionId(null);
      setEditDescription("");
      setEditAmount("");
      setEditCategory("");
      setEditDate("");
    } else {
      console.error('Failed to update transaction');
    }
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
