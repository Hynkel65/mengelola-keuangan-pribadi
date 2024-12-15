import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GlobalContext } from '../context/GlobalState';
import moneyFormatter from "../utils/MoneyFormatter";

// Register necessary Chart.js components
ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Function to group data by month
function groupByMonth(data) {
  const groupedData = {};
  data.forEach(item => {
    const month = item.date.substring(0, 7); // Extract YYYY-MM from date
    if (!groupedData[month]) {
      groupedData[month] = { income: 0, expense: 0 };
    }
    groupedData[month].income += item.amount; // Aggregate income
  });
  
  // Convert grouped data into an array of objects
  return Object.entries(groupedData).map(([month, { income }]) => ({
    month,
    income,
  }));
}

function Chart() {
  const { incomes, expenses } = useContext(GlobalContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const groupedIncomes = groupByMonth(incomes);
    const groupedExpenses = groupByMonth(expenses);

    // Merge income and expenses data by month
    const mergedData = groupedIncomes.map(({ month, income }) => ({
      month,
      income,
      expense: (groupedExpenses.find(exp => exp.month === month) || { income: 0 }).income,
    }));

    setChartData(mergedData);
  }, [incomes, expenses]);

  // Prepare data for the chart
  const data = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Pendapatan',
        data: chartData.map(item => item.income),
        backgroundColor: 'green',
        borderColor: 'white',
        tension: 0.2,
      },
      {
        label: 'Pengeluaran',
        data: chartData.map(item => item.expense),
        backgroundColor: 'red',
        borderColor: 'white',
        tension: 0.2,
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return moneyFormatter(context.raw);
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="chart">
      <Line data={data} options={options} />
    </div>
  );
}

export default Chart;