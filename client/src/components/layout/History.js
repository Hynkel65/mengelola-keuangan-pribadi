import React, { useContext } from 'react';
import moneyFormatter from '../utils/MoneyFormatter';
import '../style/History.css';
import { GlobalContext } from '../context/GlobalState';

function History() {
  // Extract incomes and expenses from global context
  const { incomes, expenses } = useContext(GlobalContext);

  // Combine incomes and expenses into a single array
  const allTransactions = [...incomes, ...expenses];

  // Sort transactions by date in descending order
  const sortedTransactions = allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get the last 4 transactions for recent history
  const recentHistory = sortedTransactions.slice(-4);

  return (
    <div className="history">
      <h2>Riwayat Terbaru</h2>
      {recentHistory.map((item) => {
        // Destructure transaction details
        const { _id, title, amount, type } = item;

        // Determine CSS class for amount based on transaction type
        const amountClass = type === 'expense' ? 'expense' : 'income';

        // Format amount with appropriate sign
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