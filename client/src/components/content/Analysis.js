import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import moneyFormatter from "../utils/MoneyFormatter";
import "../style/Analysis.css";

const Analysis = () => {
  const { incomes, expenses } = useContext(GlobalContext);

  // Group transactions by month and calculate total amount for each month
  const groupByMonth = (transactions) => {
    return transactions.reduce((acc, txn) => {
      const month = new Date(txn.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + txn.amount;
      return acc;
    }, {});
  };

  const incomeByMonth = groupByMonth(incomes);
  const expenseByMonth = groupByMonth(expenses);

  // Calculate the number of unique months with data
  const totalMonths = new Set([
    ...Object.keys(incomeByMonth),
    ...Object.keys(expenseByMonth),
  ]).size;

  const monthsWithData = totalMonths || 1; // Ensure division by zero doesn't occur

  // Calculate monthly averages
  const monthlyAvgIncome = Math.round(
    Object.values(incomeByMonth).reduce((a, b) => a + b, 0) / monthsWithData
  );

  const monthlyAvgExpense = Math.round(
    Object.values(expenseByMonth).reduce((a, b) => a + b, 0) / monthsWithData
  );

  const avgMonthlyBalance = Math.round(monthlyAvgIncome - monthlyAvgExpense);

  // Calculate total savings
  const totalSavings = Math.round(
    incomes.reduce((a, b) => a + b.amount, 0) -
    expenses.reduce((a, b) => a + b.amount, 0)
  );

  // Group expenses by category
  const expenseCategories = expenses.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  // Get top 3 expense categories
  const top3ExpenseCategories = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Group incomes by category
  const incomeCategoriesData = incomes.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  // Prepare data for expense chart
  const expenseChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories).map((val) => Math.round(val)),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  // Prepare data for income chart
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
      <div className="analysis-item">
        <h2>Rata-rata tiap bulan</h2>
        <p>Rata-rata Pendapatan: {moneyFormatter(monthlyAvgIncome)}</p>
        <p>Rata-rata Pengeluaran: {moneyFormatter(monthlyAvgExpense)}</p>
        <p>Rata-rata Saldo: {moneyFormatter(avgMonthlyBalance)}</p>
      </div>
      <div className="charts">
        <div className="chart">
          <Doughnut 
            data={incomeChartData} 
            options={{
              plugins: {
                legend: {
                  labels: { 
                    color: 'white' 
                  }
                },
                title: {
                  display: true,
                  text: 'Distribusi Pendapatan',
                  color: '#00A2FF',
                  font: {
                    size: 18,
                  },
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function(context) {
                      return moneyFormatter(context.raw);
                    }
                  }
                }
              },
              responsive: true,
              maintainAspectRatio: false
            }} 
          />
        </div>
        <div className="chart">
          <Doughnut 
            data={expenseChartData} 
            options={{
              plugins: {
                legend: {
                  labels: { 
                    color: 'white' 
                  }
                },
                title: {
                  display: true,
                  text: 'Distribusi Pengeluaran',
                  color: '#00A2FF',
                  font: {
                    size: 18,
                  },
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function(context) {
                      return moneyFormatter(context.raw);
                    }
                  }
                }
              },
              responsive: true,
              maintainAspectRatio: false
            }} 
          />
        </div>
      </div>
      <div className="analysis-item-container">
        <div className="analysis-item">
          <h2>Top 3 Kategori Pengeluaran</h2>
          <ul>
            {top3ExpenseCategories.map(([category, amount], index) => (
              <li key={index}>
                {category}: {moneyFormatter(Math.round(amount))}
              </li>
            ))}
          </ul>
        </div>
        <div className="analysis-item">
          <h2>Saldo Total</h2>
          <p>{moneyFormatter(totalSavings)}</p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;