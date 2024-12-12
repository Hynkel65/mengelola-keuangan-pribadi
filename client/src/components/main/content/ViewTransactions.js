import React, { useContext, useState } from "react";
import "../style/ViewTransactions.css";
import { GlobalContext } from "../../context/GlobalState";
import ImageModal from "../utils/ImageModal";

const ViewTransaction = () => {
  const { incomes, expenses } = useContext(GlobalContext);

  // Combine incomes and expenses for a unified view
  const transactions = [...incomes, ...expenses].map((txn) => ({
    ...txn,
    type: incomes.includes(txn) ? "Income" : "Expense",
  }));

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sort logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
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
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          {/* Add more categories as needed */}
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
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn, index) => (
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
              <td>{txn.amount}</td>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <ImageModal image={selectedImage} closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default ViewTransaction;
