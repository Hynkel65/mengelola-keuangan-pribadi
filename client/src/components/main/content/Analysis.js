import React, { useContext, useState } from 'react';
import {GlobalContext} from '../../context/GlobalState';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import '../style/Analysis.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analysis = () => {
  const { incomes, expenses } = useContext(GlobalContext);
  
  const [incomeData, setIncomeData] = useState({ labels: [], datasets: [] });
  const [expenseData, setExpenseData] = useState({ labels: [], datasets: [] });

  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = today.getFullYear().toString();
  const initialSelectedDate = `${currentYear}-${currentMonth}`;

  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  }

  const getMonthlyData = () => {
    if (!selectedDate) return null;

    const selectedMonth = new Date(selectedDate).getMonth() + 1;
    const filteredIncomes = incomes.filter(
      (income) => new Date(income.data).getMonth() + 1 === selectedMonth
    );
    const filteredExpenses = expenses.filter(
      (expense) => new Date(expense.date).getMonth() + 1 === selectedMonth
    );

    //Calculate total income and expense for each category
    const incomeData = {};
    const expenseData = {};

    filteredIncomes.forEach((income) => {
      if (incomeData[income.category]) {
        incomeData[income.category] += income.amount;
      } else {
        incomeData[income.category] = income.amount;
      }
    });

    filteredExpenses.forEach((expense) => {
      if (expenseData[expense.category]) {
        expenseData[expense.category] += expense.amount;
      } else {
        expenseData[expense.category] = expense.amount;
      }
    });

    return { incomeData, expenseData };
  }

  // Fetch and process data when "Get Monthly Data" button is clicked
  const handleGetMonthlyData = () => {
    const monthlyData = getMonthlyData();
    // Now you can use the monthlyData to update the doughnut charts
    
    const incomeLabels = Object.keys(monthlyData.incomeData);
    const incomeValues = Object.values(monthlyData.incomeData);
    const expenseLabels = Object.keys(monthlyData.expenseData);
    const expenseValues = Object.values(monthlyData.expenseData);

    // Update the state for the doughnut charts with the processed data
    setIncomeData({
      labels: incomeLabels,
      datasets: [
        {
          data: incomeValues,
          backgroundColor: getColors(incomeLabels.length), // You can implement a function to get unique colors for each category
        },
      ],
    });

    setExpenseData({
      labels: expenseLabels,
      datasets: [
        {
          data: expenseValues,
          backgroundColor: getColors(expenseLabels.length),
        },
      ],
    });
  };

  const getCurrentMonthYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };  

  // Helper function to generate unique colors for the doughnut chart
  const getColors = (length) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  const chartOptions = {
    responsive: true,
    aspectRatio: 2,
  };  

  return (
    <div className="analysis-con">
      <div className="analysis-heading">Analysis</div>
      <input
        type="month"
        value={selectedDate}
        onChange={handleDateChange}
        max={getCurrentMonthYear()}
      />
      <button onClick={handleGetMonthlyData}>Get Monthly Data</button>
      <div className="main-content">

        {/* Left Content */}
        <div className="left-content">
          <div className="income-analysis">
            <h2>Income Analysis</h2>
            <Doughnut 
              data={incomeData} 
              options={chartOptions}
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="right-content">
          <div className="income-analysis">
            <h2>Expense Analysis</h2>
            <Doughnut 
              data={expenseData}
              options={chartOptions}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Analysis;
