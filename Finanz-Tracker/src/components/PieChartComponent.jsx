import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

const PieChartComponent = ({ transactions }) => {
  const dataForPieChart = transactions.map((transaction, index) => ({
    name: transaction.category,
    value: transaction.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
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
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        labelLine={true}
      >
        {dataForPieChart.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
