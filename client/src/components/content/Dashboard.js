import React, { useContext, useMemo } from 'react';
import Chart from '../layout/Chart';
import History from '../layout/History';
import moneyFormatter from '../utils/MoneyFormatter';
import '../style/Dashboard.css';
import { GlobalContext } from '../context/GlobalState';

const Dashboard = () => {
  const { incomes, expenses } = useContext(GlobalContext);

  const totalIncome = useMemo(() =>
    incomes.reduce((total, income) => total + income.amount, 0),
    [incomes]
  );

  const totalExpense = useMemo(() =>
    expenses.reduce((total, expense) => total + expense.amount, 0),
    [expenses]
  );

  const currentDate = new Date();

  const totalIncomeThisMonth = incomes.reduce((total, income) => {
    const incomeDate = new Date(income.date);
    if (
      incomeDate.getMonth() === currentDate.getMonth() &&
      incomeDate.getFullYear() === currentDate.getFullYear()
    ) {
      return total + parseFloat(income.amount);
    }
    return total;
  }, 0);

  const totalExpenseThisMonth = expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);
    if (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    ) {
      return total + parseFloat(expense.amount);
    }
    return total;
  }, 0);

  return (
    <div className="dashboard-con">
      <Chart />
      <div className="main-content">
        <div className="left-content">
          <div className="con">
            <h2>Saldo</h2>
            <h3>{moneyFormatter(totalIncome - totalExpense)}</h3>
          </div>
          <div className="con">
            <h2>Pemasukan</h2><span>bulan ini</span>
            <h3>{moneyFormatter(totalIncomeThisMonth)}</h3>
          </div>
          <div className="con">
            <h2>Pengeluaran</h2><span>bulan ini</span>
            <h3>{moneyFormatter(totalExpenseThisMonth)}</h3>
          </div>
        </div>
        <div className="right-content">
          <div className="history-con">
            <History />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;