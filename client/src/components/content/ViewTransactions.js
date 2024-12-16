import React, { useContext, useState } from "react";
import "../style/ViewTransactions.css";
import moneyFormatter from '../utils/MoneyFormatter';
import { GlobalContext } from "../context/GlobalState";
import ImageModal from "../utils/ImageModal";
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';

const ViewTransaction = ({ setSelectedIncome, setSelectedExpense, navigateTo }) => {
  // Fetching incomes, expenses, and deletion functions from Global Context
  const { incomes, expenses, deleteIncome, deleteExpense } = useContext(GlobalContext);

  // Combine incomes and expenses into a single transactions array with type indication
  const transactions = [...incomes, ...expenses].map((txn) => ({
    ...txn,
    type: incomes.includes(txn) ? "Income" : "Expense",
  }));

  // State declarations
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sorting transactions based on sortConfig
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig.key) {
      return new Date(b.date) - new Date(a.date);
    }
    const order = sortConfig.direction === "ascending" ? 1 : -1;
    if (sortConfig.key === 'date') {
      return (new Date(a.date) - new Date(b.date)) * order;
    }
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
  });

  // Filtering transactions based on searchTerm, filterCategory, and filterType
  const filteredTransactions = sortedTransactions.filter((txn) => {
    const matchesSearch = searchTerm === "" || Object.values(txn).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || txn.category === filterCategory;
    const matchesType = filterType === "" || txn.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === "ascending" ? "descending" : "ascending";
      return { key, direction };
    });
  };

  // Handle image click to show modal
  const handleImgClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setShowModal(true);
  };

  // Handle transaction edit
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
      <div className="filter-container">
        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          <option value="active_income">Pendapatan Aktif</option>
          <option value="passive_income">Pendapatan Pasif</option>
          <option value="other_income">Pendapatan Lainya</option>
=======
          <option value="basic_needs">Kebutuhan Pokok</option>
          <option value="education">Pendidikan</option>
          <option value="entertainment">Hiburan</option>
          <option value="social">Sosial</option>
          <option value="finance">Keuangan</option>
          <option value="unexpected_expenses">Pengeluaran Tidak Terduga</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Semua Tipe</option>
          <option value="Income">Pendapatan</option>
          <option value="Expense">Pengeluaran</option>
        </select>
      </div>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Gambar</th>
            <th onClick={() => handleSort("title")}>Judul</th>
            <th onClick={() => handleSort("description")}>Deskripsi</th>
            <th onClick={() => handleSort("category")}>Kategori</th>
            <th onClick={() => handleSort("amount")}>Jumlah</th>
            <th onClick={() => handleSort("date")}>Tanggal</th>
            <th onClick={() => handleSort("type")}>Tipe</th>
            <th>Aksi</th>
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
              <td className="action-btn">
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