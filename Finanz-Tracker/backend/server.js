const express = require('express');// Import des Express-Moduls
const bodyParser = require('body-parser'); // Import des Body-Parser-Moduls
const cors = require('cors'); // Import des CORS-Moduls
const transactionsRoutes = require('./routes/transactions'); // Import der Transaktions-Routen

const app = express(); // Erstellen einer neuen Express-App
const PORT = process.env.PORT || 5000; // Port-Definition

app.use(cors()); // Verwende CORS für Cross-Origin-Requests
app.use(bodyParser.json()); // Verwende Body-Parser für JSON-Requests

app.get('/', (req, res) => {
  res.send('Willkommen auf dem Server!');
}); // Definiere Root-Route

app.use('/api/transactions', transactionsRoutes); // Verwende Transaktions-Routen unter /api/transactions

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); // Starte Server auf Port 5000


module.exports = app; // Exportiere Express-App für Tests