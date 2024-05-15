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

  const getTotalAmount = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const filteredTransactions = transactions
    .filter(transaction => transaction.description.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount);

  const dataForPieChart = transactions.map((transaction, index) => ({
    name: transaction.description,
    value: transaction.amount,
    color: COLORS[index % COLORS.length]
  }));

  return (
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
      <button onClick={handleAddTransaction}>Hinzufügen</button>
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sortieren ({sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'})
      </button>
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


