import { useEffect, useState } from 'react';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import { transactionService } from '../services/transactions';
import { Package, ClipboardList, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    transactions: 0,
    revenue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [products, categories, transactions] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          transactionService.getAll(),
        ]);
        setStats({
          products: products.length,
          categories: categories.length,
          transactions: transactions.length,
          revenue: transactions.reduce((sum, t) => sum + Number(t.total_amount), 0),
        });
        setRecentTransactions(transactions.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow flex items-center">
          <Package className="mr-4 text-blue-600" size={32} />
          <div>
            <p className="text-sm text-gray-600">Products</p>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <ClipboardList className="mr-4 text-green-600" size={32} />
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold">{stats.categories}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <ClipboardList className="mr-4 text-purple-600" size={32} />
          <div>
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold">{stats.transactions}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <DollarSign className="mr-4 text-yellow-600" size={32} />
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">
              ${stats.revenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Cashier</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">#{t.id}</td>
                  <td className="p-3">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{t.user?.name}</td>
                  <td className="p-3 text-right">
                    ${Number(t.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
