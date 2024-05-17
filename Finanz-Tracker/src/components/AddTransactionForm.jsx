import React, { useState } from "react";

const AddTransactionForm = ({ onAddTransaction, categories }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = () => {
    if (amount && category && date) {
      onAddTransaction({
        description,
        amount: parseFloat(amount),
        type,
        category,
        date,
      });
      setDescription("");
      setAmount("");
      setCategory("");
      setDate("");
      setType("expense");
    }
  };

  return (
    <div>
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
      <button onClick={handleSubmit}>Hinzufügen</button>
    </div>
  );
};

export default AddTransactionForm;