import React, { useRef } from 'react';
import incomeOptions from '../content/Income';
import expenseOptions from '../content/Expense';
import '../style/Form.css';

const Form = ({
  handleSubmit,
  handleInputChange,
  handleUpdate,
  formData,
  categoryOptions,
  formMode,
  selectedImage
}) => {
  // Reference for the file input to potentially manipulate it later
  const fileInputRef = useRef(null);

  // Determine button text based on form mode
  const buttonText = formMode === "add" ? "Add" : "Update";

  // Determine categories based on provided options or default to income/expense
  const categories = Array.isArray(categoryOptions)
    ? categoryOptions
    : categoryOptions === "income"
    ? incomeOptions
    : expenseOptions;

  return (
    <form 
      onSubmit={formMode === 'add' ? handleSubmit : handleUpdate}
      encType='multipart/form-data'
    >
      <div>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          maxLength="20"
          placeholder="Judul"
          required
        />
      </div>
      
      <div>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          maxLength="20"
          placeholder="Jumlah"
          required
        />
      </div>

      <div>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Pilih Opsi</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          maxLength="50"
          placeholder="Deskripsi"
          required
        />
      </div>

      <div>
        {formMode === 'update' && selectedImage && (
          <div className="img-con">
            <img src={selectedImage} alt="Income" />
          </div>
        )}
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          ref={fileInputRef}
        />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default Form;