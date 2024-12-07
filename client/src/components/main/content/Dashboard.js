import React, { useContext, useMemo } from 'react';
import Chart from '../layout/Chart';
import History from '../layout/History';
import moneyFormatter from '../utils/MoneyFormatter';

import '../style/Dashboard.css';
import { GlobalContext } from '../../context/GlobalState';

const Dashboard = () => {
  const { incomes, expenses } = useContext(GlobalContext);

  const totalIncome = useMemo(() => incomes.reduce((total, income) => total + income.amount, 0), [incomes]);
  const totalExpense = useMemo(() => expenses.reduce((total, expense) => total + expense.amount, 0), [expenses]);

  return (
    <div className="dashboard-con">
      <div className="dashboard-heading">Dashboard</div>
      <div className="balance-con">
        <h2>Balance</h2>
        <p>{moneyFormatter(totalIncome - totalExpense)}</p>
      </div>
      <div className="income-expense-con">
        <div className="dashboard-income-con">
          <h2>Incomes</h2>
          <p>{moneyFormatter(totalIncome)}</p>
        </div>
        <div className="dashboard-expense-con">
          <h2>Expenses</h2>
          <p>{moneyFormatter(totalExpense)}</p>
        </div>
      </div>
      <div className="main-content">

        {/* Left Content */}
        <div className="left-content">
          <div className="chart-con">
            <Chart />
          </div>
        </div>

        {/* Right Content */}
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
