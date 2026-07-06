import { useEffect, useState } from 'react';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', category_id: '', price: '', stock: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    const data = await productService.getAll();
    setProducts(data);
  };
  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  useEffect(() => {
    fetch();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category_id: Number(form.category_id),
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing) {
        await productService.update(editing, payload);
      } else {
        await productService.create(payload);
      }
      setForm({ name: '', category_id: '', price: '', stock: '' });
      setEditing(null);
      await fetch();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await productService.delete(id);
        await fetch();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editing ? 'Edit Product' : 'Add Product'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
        >
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Category</label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              required
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: '', category_id: '', price: '', stock: '' });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Price</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name}</td>
                <td className="p-3 text-right">
                  ${Number(p.price).toFixed(2)}
                </td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
