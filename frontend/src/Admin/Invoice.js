import React, { useState } from "react";
import "./Invoice.css"; // Use the same or a custom CSS file for styling

const JobInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    clientName: "",
    clientAddress: "",
    invoiceNumber: "",
    date: "",
    items: [{ description: "", quantity: 0, price: 0 }],
    taxRate: 0,
    discount: 0,
  });

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index][name] = value;
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 0, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * invoiceData.taxRate) / 100;
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle invoice submission, send data to backend
    console.log("Invoice Data Submitted", invoiceData);
  };

  return (
    <div className="invoice-page">
      <h1>Create Job Invoice</h1>
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={invoiceData.clientName}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, clientName: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Client Address:</label>
          <textarea
            name="clientAddress"
            value={invoiceData.clientAddress}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                clientAddress: e.target.value,
              })
            }
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                invoiceNumber: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={invoiceData.date}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, date: e.target.value })
            }
            required
          />
        </div>

        <h2>Invoice Items</h2>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="invoice-item">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <div className="form-group">
          <label>Tax Rate (%):</label>
          <input
            type="number"
            name="taxRate"
            value={invoiceData.taxRate}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, taxRate: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Discount (%):</label>
          <input
            type="number"
            name="discount"
            value={invoiceData.discount}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, discount: e.target.value })
            }
          />
        </div>

        <h2>Summary</h2>
        <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
        <p>Total: ${calculateTotal().toFixed(2)}</p>

        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
};

export default JobInvoice;
