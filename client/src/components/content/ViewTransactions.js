import React, { useContext, useState } from "react";
import "../style/ViewTransactions.css";
import moneyFormatter from '../utils/MoneyFormatter';
import { GlobalContext } from "../context/GlobalState";
import ImageModal from "../utils/ImageModal";
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';

const ViewTransaction = ({ setSelectedIncome, setSelectedExpense, navigateTo }) => {
  const { incomes, expenses, deleteIncome, deleteExpense } = useContext(GlobalContext);

  // Combine incomes and expenses for a unified view
  const transactions = [...incomes, ...expenses].map((txn) => ({
    ...txn,
    type: incomes.includes(txn) ? "Income" : "Expense",
  }));

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set to 10 for ten items per page

  // Sort logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    // Default sort by date if no sort config
    if (!sortConfig.key) {
      return new Date(b.date) - new Date(a.date);
    }
    
    // Handle date sorting specifically
    if (sortConfig.key === 'date') {
      const order = sortConfig.direction === "ascending" ? 1 : -1;
      return (new Date(a.date) - new Date(b.date)) * order;
    }
    
    // Handle other fields
    const order = sortConfig.direction === "ascending" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
  });

  // Filter and Search logic
  const filteredTransactions = sortedTransactions.filter((txn) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(txn)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || txn.category === filterCategory;
    const matchesType = filterType === "" || txn.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Get current transactions for the current page
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending";
      return { key, direction };
    });
  };

  const handleImgClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    if (transaction.type === 'Income') {
      setSelectedIncome(transaction);
      navigateTo('income');
    } else if (transaction.type === 'Expense') {
      setSelectedExpense(transaction);
      navigateTo('expense');
    }
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="view-transactions-con">
      <div className="view-transactions-heading">View Transactions</div>
      {/* Search and Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="salary">Salary</option>
          <option value="freelancing">Freelancing</option>
          <option value="investments">Investments</option>
          <option value="stocks">Stocks</option>
          <option value="bitcoin">Bitcoin</option>
          <option value="bank">Bank Transfer</option>
          <option value="youtube">Youtube</option>
          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeaways</option>
          <option value="clothing">Clothing</option>
          <option value="traveling">Traveling</option>
          <option value="others">Others</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Image</th>
            <th onClick={() => handleSort("title")}>Title</th>
            <th onClick={() => handleSort("description")}>Description</th>
            <th onClick={() => handleSort("category")}>Category</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("date")}>Date</th>
            <th onClick={() => handleSort("type")}>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((txn, index) => (
            <tr key={index}>
              <td>
                <div
                  className="img-con"
                  onClick={() => handleImgClick(txn.image)}
                >
                  {txn.image && (
                    <img
                      src={`/uploads/${txn.image}`}
                      alt={txn.type}
                      className="transaction-img"
                    />
                  )}
                </div>
              </td>
              <td>{txn.title}</td>
              <td>{txn.description}</td>
              <td>{txn.category}</td>
              <td>{moneyFormatter(txn.amount)}</td>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.type}</td>
              <td>
                <button onClick={() => handleEditTransaction(txn)} className="edit-btn">
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => {
                    setTransactionToDelete(txn);
                    setShowDeleteConfirmation(true);
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {showModal && <ImageModal image={selectedImage} closeModal={() => setShowModal(false)} />}
      
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={() => {
          if (transactionToDelete) {
            if (transactionToDelete.type === 'Income') {
              deleteIncome(transactionToDelete._id);
            } else {
              deleteExpense(transactionToDelete._id);
            }
            setTransactionToDelete(null);
            setShowDeleteConfirmation(false);
          }
        }}
      />
    </div>
  );
};

export default ViewTransaction;