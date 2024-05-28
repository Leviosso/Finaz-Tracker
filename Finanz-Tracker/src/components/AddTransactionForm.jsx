import React, { useState } from "react";

const AddTransactionForm = ({ onAddTransaction, categories }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount && category && date) {
      const newTransaction = {
        description,
        amount: parseFloat(amount),
        type,
        category,
        date,
      };

      const response = await fetch('http://localhost:5000/api/transactions', { // Add the correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        onAddTransaction(await response.json());
        setDescription("");
        setAmount("");
        setCategory("");
        setDate("");
        setType("expense");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Kategorie auswählen</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>
      <button type="submit">Hinzufügen</button>
    </form>
  );
};

export default AddTransactionForm;
