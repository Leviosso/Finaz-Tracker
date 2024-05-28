const express = require("express"); // Import des Express-Frameworks
const router = express.Router(); // Erstellen eines neuen Router-Objekts
const { v4: uuidv4 } = require("uuid"); // Import der UUID-Generierungsfunktion
const fs = require("fs"); // Import des File-System-Moduls
const path = require("path"); // Import des Path-Moduls

const transactionsFilePath = path.join(__dirname, "../data/transactions.json"); // Pfad zur JSON-Datei

// Lese und speichere Transaktionen in Datei
const loadTransactions = () => {
  if (fs.existsSync(transactionsFilePath)) {
    const data = fs.readFileSync(transactionsFilePath, "utf-8");
    return JSON.parse(data);
  }
  return [];
};
 
// Speichere Transaktionen in Datei
const saveTransactions = (transactions) => {
  fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions, null, 2));
};

let transactions = loadTransactions(); // Lese vorhandene Transaktionen

// Alle Transaktionen ausgeben
router.get("/", (req, res) => {
  res.json(transactions); // Gebe alle Transaktionen als JSON zurück
});

// Einfügen einer neuen Transaktion
router.post("/", (req, res) => {
  const transaction = { id: uuidv4(), ...req.body }; // Lese vorhandene Transaktionen
  transactions.push(transaction); // Füge neue Transaktion hinzu
  saveTransactions(transactions); // Speichere Transaktionen in Datei
  res.status(201).json(transaction); // Gebe neue Transaktion als JSON zurück
});

// Löschfunktion für Transaktionen
router.delete("/:id", (req, res) => {
  transactions = transactions.filter((t) => t.id !== req.params.id); // Filtere Transaktionen nach ID
  saveTransactions(transactions); // Speichere Transaktionen in Datei
  res.status(204).end();
});

// Put (Update) Funktion für Transaktionen 
router.put('/:id', (req, res) => {
  const index = transactions.findIndex((t) => t.id === req.params.id); // Finde Index der Transaktion
  if (index !== -1) {
    transactions[index] = { id: req.params.id, ...req.body }; // Aktualisiere Transaktion
    saveTransactions(transactions); // Speichere Transaktionen in Datei
    res.json(transactions[index]); // Gebe aktualisierte Transaktion als JSON zurück
  } else {
    res.status(404).json({ message: 'Transaction not found' }); // Gebe Fehlermeldung zurück
  }
});

module.exports = router; // Exportiere Router-Objekt für Verwendung in anderen Dateien
