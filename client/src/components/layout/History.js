import React, { useContext } from 'react';
import moneyFormatter from '../utils/MoneyFormatter';
import '../style/History.css';
import { GlobalContext } from '../context/GlobalState';

function History() {
  const { incomes, expenses } = useContext(GlobalContext);
  const allTransactions = [...incomes, ...expenses];
  const sortedTransactions = allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentHistory = sortedTransactions.slice(-4);

  return (
    <div className="history">
      <h2>Riwayat Terbaru</h2>
      {recentHistory.map((item) => {
        const { _id, title, amount, type } = item;
        const amountClass = type === 'expense' ? 'expense' : 'income';
        const formattedAmount = type === 'expense' ? `- ${moneyFormatter(amount <= 0 ? 0 : amount)}` : `+ ${moneyFormatter(amount <= 0 ? 0 : amount)}`;
        
        return (
          <div key={_id} className={`history-item ${type}`}>
            <p className="item-title">{title}</p>
            <p className={`item-amount ${amountClass}`}>
              {formattedAmount}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default History;