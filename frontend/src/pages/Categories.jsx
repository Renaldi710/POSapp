import { useEffect, useState } from 'react';
import { categoryService } from '../services/categories';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await categoryService.update(editing, { name });
      } else {
        await categoryService.create({ name });
      }
      setName('');
      setEditing(null);
      await fetch();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this category?')) {
      try {
        await categoryService.delete(id);
        await fetch();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editing ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Products</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.products_count}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
