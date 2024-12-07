import React, { useContext, useState } from 'react';
import moneyFormatter from '../utils/MoneyFormatter';
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';
import ImageModal from '../utils/ImageModal';

import '../style/ViewTransactions.css';
import { GlobalContext } from '../../context/GlobalState';

const ViewTransaction = () => {
  const { incomes, expenses } = useContext(GlobalContext);


  return (
    <div className="view-transactions-con">
      <div className="view-transactions-heading">View Transactions</div>
      <div className="view-transactions-table-con">
        <table className="view-income-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Display incomes */}
            {incomes.map((income) => (
              <tr key={income._id}>
                <td>{income.title}</td>
                <td>{moneyFormatter(income.amount)}</td>
                <td>
                  {new Date(income.date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td>{income.category}</td>
                <td>{income.description}</td>
                <td className='action'>
                  {/* Add your edit and delete buttons here */}
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="view-expenses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Display expenses */}
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.title}</td>
                <td>{moneyFormatter(expense.amount)}</td>
                <td>
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td className='action'>
                  {/* Add your edit and delete buttons here */}
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTransaction;
