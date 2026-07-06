import { Minus, Plus, Trash2 } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = usePOS();

  const decrease = () => {
    if (item.quantity > 1) updateQuantity(item.product.id, item.quantity - 1);
  };

  return (
    <div className="flex items-center justify-between border-b py-2">
      <div>
        <p className="font-medium">{item.product.name}</p>
        <p className="text-sm text-gray-600">@{Number(item.price).toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={decrease}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="p-1 text-red-600 hover:bg-red-100 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="font-semibold w-24 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};
