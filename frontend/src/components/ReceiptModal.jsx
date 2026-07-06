import { Printer, X } from 'lucide-react';

export const ReceiptModal = ({ transaction, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="border-t border-b py-4 mb-4">
          <p>
            <strong>Transaction ID:</strong> #{transaction.id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Cashier:</strong> {transaction.user?.name}
          </p>
          <p>
            <strong>Status:</strong> {transaction.status}
          </p>
        </div>
        <table className="w-full mb-4">
          <thead>
            <tr className="text-left">
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>${Number(item.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${Number(transaction.total_amount).toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Printer size={18} className="mr-2" /> Print
          </button>
        </div>
      </div>
    </div>
  );
};
