import React, { useRef } from 'react';
import incomeOptions from '../content/Income';
import expenseOptions from '../content/Expense';

import '../style/Form.css'

const Form = ({ handleSubmit, handleInputChange, handleUpdateIncome, formData, categoryOptions, categoryType, formMode, selectedImage }) => {
  const isIncome = categoryType === "income";
  const buttonText = formMode === "add" ? `Add ${isIncome ? "Income" : "Expense"}` : `Update ${isIncome ? "Income" : "Expense"}`;
  
  const fileInputRef = useRef(null);
  const getFileInputRef = () => fileInputRef;

  const categories = Array.isArray(categoryOptions)
    ? categoryOptions
    : categoryOptions === "income"
    ? incomeOptions
    : expenseOptions;

  return (
    <form 
      onSubmit={formMode === 'add' ? handleSubmit : handleUpdateIncome}
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
            placeholder='Title'
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
            placeholder='Amount'
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
            <option value=""  disabled >Select Option</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
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
            placeholder='Description'
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
