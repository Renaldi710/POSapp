import { useEffect, useState } from 'react';
import { transactionService } from '../services/transactions';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService
      .getAll()
      .then((data) => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading transactions...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Cashier</th>
              <th className="text-right p-3">Total</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-3">#{t.id}</td>
                <td className="p-3">
                  {new Date(t.created_at).toLocaleString()}
                </td>
                <td className="p-3">{t.user?.name}</td>
                <td className="p-3 text-right">
                  ${Number(t.total_amount).toFixed(2)}
                </td>
                <td className="p-3">
                  <span className="capitalize">{t.status}</span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
