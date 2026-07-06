import { Plus } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = usePOS();

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
        <p className="text-lg font-bold text-blue-600">
          ${Number(product.price).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">Stok: {product.stock}</p>
      </div>
      <button
        onClick={() => addToCart(product)}
        disabled={product.stock <= 0}
        className="mt-2 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded py-2 disabled:opacity-50"
      >
        <Plus size={18} className="mr-1" /> Tambah
      </button>
    </div>
  );
};
