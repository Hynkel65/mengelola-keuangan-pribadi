import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../../context/GlobalState";
import moneyFormatter from "../utils/MoneyFormatter";
import "../style/Analysis.css";

const Analysis = () => {
  const { incomes, expenses } = useContext(GlobalContext);

  // Helper: Group transactions by month
  const groupByMonth = (transactions) => {
    return transactions.reduce((acc, txn) => {
      const month = new Date(txn.date).toISOString().slice(0, 7); // Format: YYYY-MM
      acc[month] = (acc[month] || 0) + txn.amount;
      return acc;
    }, {});
  };

  // Get grouped data
  const incomeByMonth = groupByMonth(incomes);
  const expenseByMonth = groupByMonth(expenses);

  // Calculate the number of months with data
  const totalMonths = new Set([
    ...Object.keys(incomeByMonth),
    ...Object.keys(expenseByMonth),
  ]).size;

  // Avoid division by zero
  const monthsWithData = totalMonths || 1;

  // Monthly averages (rounded)
  const monthlyAvgIncome = Math.round(
    Object.values(incomeByMonth).reduce((a, b) => a + b, 0) / monthsWithData
  );
  const monthlyAvgExpense = Math.round(
    Object.values(expenseByMonth).reduce((a, b) => a + b, 0) / monthsWithData
  );

  // Average monthly balance (rounded)
  const avgMonthlyBalance = Math.round(monthlyAvgIncome - monthlyAvgExpense);

  // Total savings (rounded)
  const totalSavings = Math.round(
    incomes.reduce((a, b) => a + b.amount, 0) -
      expenses.reduce((a, b) => a + b.amount, 0)
  );

  // Expense categories breakdown
  const expenseCategories = expenses.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  const top3ExpenseCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Prepare data for donut charts
  const incomeCategoriesData = incomes.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  const expenseChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories).map((val) => Math.round(val)),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  const incomeChartData = {
    labels: Object.keys(incomeCategoriesData),
    datasets: [
      {
        data: Object.values(incomeCategoriesData).map((val) => Math.round(val)),
        backgroundColor: ["#4CAF50", "#FFC107", "#FF9800", "#F44336"],
      },
    ],
  };

  return (
    <div className="analysis-con">
      {/* Monthly Averages */}
      <div className="analysis-item">
        <h3>Monthly Averages</h3>
        <p>Average Income: {moneyFormatter(monthlyAvgIncome)}</p>
        <p>Average Expense: {moneyFormatter(monthlyAvgExpense)}</p>
        <p>Average Monthly Balance: {moneyFormatter(avgMonthlyBalance)}</p>
      </div>

      {/* Donut Charts */}
      <div className="charts">
        <div className="chart">
          <h4>Income Categories</h4>
          <Doughnut data={incomeChartData} options={{plugins: {legend: {labels: {color: 'white'}}}}}/>
        </div>
        <div className="chart">
          <h4>Expense Categories</h4>
          <Doughnut data={expenseChartData} options={{plugins: {legend: {labels: {color: 'white'}}}}}/>
        </div>
      </div>

      {/* Top 3 Expense Categories */}
      <div className="analysis-item">
        <h3>Top 3 Expense Categories</h3>
        <ul>
          {top3ExpenseCategories.map(([category, amount], index) => (
            <li key={index}>
              {category}: {moneyFormatter(Math.round(amount))}
            </li>
          ))}
        </ul>
      </div>

      {/* Total Savings */}
      <div className="analysis-item">
        <h3>Total Savings</h3>
        <p>{moneyFormatter(totalSavings)}</p>
      </div>
    </div>
  );
};

export default Analysis;
