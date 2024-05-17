import React from "react";

const EditTransactionModal = ({
  selectedTransaction,
  categories,
  editDescription,
  setEditDescription,
  editAmount,
  setEditAmount,
  editCategory,
  setEditCategory,
  editDate,
  setEditDate,
  onUpdateTransaction,
}) => {
  return (
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
          <button
            key={index}
            className={cat.icon === editCategory ? "selected" : ""}
            onClick={() => setEditCategory(cat.icon)}
          >
            {cat.icon}
          </button>
        ))}
      </div>
      <button onClick={onUpdateTransaction}>Speichern</button>
    </div>
  );
};

export default EditTransactionModal;
