import React, { useContext, useEffect, useState } from 'react';
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import { Line } from 'react-chartjs-2';

import '../style/Chart.css';
import { GlobalContext } from '../../context/GlobalState';

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function groupByMonth(data) {
  const groupedData = {};

  data.forEach(item => {
    const month = item.date.substring(0, 7); // Extract the year and month (YYYY-MM)
    if (!groupedData[month]) {
      groupedData[month] = { income: 0, expense: 0 };
    }

    groupedData[month].income += item.amount;
  });

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

    // Merge income and expense data for each month
    const mergedData = groupedIncomes.map(({ month, income }) => ({
      month,
      income,
      expense: (groupedExpenses.find(exp => exp.month === month) || { income: 0 }).income,
    }));

    setChartData(mergedData);
  }, [incomes, expenses]);

  const data = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: chartData.map(item => item.income),
        backgroundColor: 'green',
        borderColor: 'white',
        tension: 0.2,
      },
      {
        label: 'Expenses',
        data: chartData.map(item => item.expense),
        backgroundColor: 'red',
        borderColor: 'white',
        tension: 0.2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
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
