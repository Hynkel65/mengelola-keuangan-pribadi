import React, { useContext, useState } from "react";
import "../style/ViewTransactions.css";
import moneyFormatter from '../utils/MoneyFormatter';
import { GlobalContext } from "../context/GlobalState";
import ImageModal from "../utils/ImageModal";
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';

const ViewTransaction = ({ setSelectedIncome, setSelectedExpense, navigateTo }) => {
  const { incomes, expenses, deleteIncome, deleteExpense } = useContext(GlobalContext);

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === "ascending" ? "descending" : "ascending";
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
      navigateTo('pemasukan');
    } else if (transaction.type === 'Expense') {
      setSelectedExpense(transaction);
      navigateTo('pengeluaran');
    }
  };

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

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: '', label: 'PEMASUKAN', disabled: true },
    { value: 'active_income', label: 'Pemasukan Aktif' },
    { value: 'passive_income', label: 'Pemasukan Pasif' },
    { value: 'other_income', label: 'Pemasukan Lainya' },
    { value: '', label: 'PENGELUARAN', disabled: true },
    { value: 'basic_needs', label: 'Kebutuhan Pokok' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'entertainment', label: 'Hiburan' },
    { value: 'social', label: 'Sosial' },
    { value: 'finance', label: 'Keuangan' },
    { value: 'unexpected_expenses', label: 'Pengeluaran Tidak Terduga' }
  ];

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
          {categories.map((category) => (
            <option
              key={category.value || category.label}
              value={category.value}
              disabled={category.disabled}
            >
              {category.label}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Semua Tipe</option>
          <option value="Income">Pemasukan</option>
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
            <th onClick={() => handleSort("title")}>
              Judul {sortConfig.key === 'title' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
            <th onClick={() => handleSort("description")}>
              Deskripsi {sortConfig.key === 'description' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
            <th onClick={() => handleSort("category")}>
              Kategori {sortConfig.key === 'category' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
            <th onClick={() => handleSort("amount")}>
              Jumlah {sortConfig.key === 'amount' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
            <th onClick={() => handleSort("date")}>
              Tanggal {sortConfig.key === 'date' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
            <th onClick={() => handleSort("type")}>
              Tipe {sortConfig.key === 'type' &&
                (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </th>
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
              <td>{categories.find(category => category.value === txn.category).label}</td>
              <td>{moneyFormatter(txn.amount)}</td>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.type === "Income" ? "Pemasukan" : "Pengeluaran"}</td>
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