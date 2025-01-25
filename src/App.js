import React, { useState } from "react";
import "./app.css";

const App = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "", quantity: "" });
  const [filterCategory, setFilterCategory] = useState(""); // Track selected category
  const [filter, setFilter] = useState(""); // Optional: Keep the search bar for name filtering
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      const updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? { ...editingItem, ...newItem } : item
      );
      setInventory(updatedInventory);
      setEditingItem(null);
    } else {
      // Add new item
      setInventory([...inventory, { ...newItem, id: Date.now() }]);
    }
    setNewItem({ name: "", category: "", quantity: "" });
  };

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, category: item.category, quantity: item.quantity });
  };

  const handleSort = () => {
    setInventory([...inventory].sort((a, b) => a.quantity - b.quantity));
  };

  const filteredInventory = inventory
    .filter((item) =>
      item.category.toLowerCase().includes(filterCategory.toLowerCase())
    )
    .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase())); // Optional: for name filter

  // Get unique categories for the dropdown
  const categories = [...new Set(inventory.map((item) => item.category))];

  return (
    <div className="app">
      <header className="header">
        <h1>📦 Inventory Management</h1>
      </header>
      <main className="container">
        <section className="form-section">
          <h2>{editingItem ? "Edit Item" : "Add Item"}</h2>
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">{editingItem ? "Update Item" : "Add Item"}</button>
            {editingItem && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({ name: "", category: "", quantity: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>
        <section className="table-section">
          <h2>Inventory List</h2>
          <div className="filter-sort">
            {/* Category filter dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Filter by Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {/* Optional: Name filter */}
            <input
              type="text"
              placeholder="Filter by Item Name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button onClick={handleSort} className="btn-secondary">Sort by Quantity</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className={item.quantity < 10 ? "low-stock" : ""}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default App;
