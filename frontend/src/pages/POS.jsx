import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { CartItem } from '../components/CartItem';
import { ReceiptModal } from '../components/ReceiptModal';
import { usePOS } from '../context/POSContext';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import { Search, Filter } from 'lucide-react';

export const POS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { cart, addToCart, total, checkout, receipt, setReceipt } = usePOS();

  const fetchProducts = async () => {
    const data = await productService.getAll();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id == categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = async () => {
    try {
      await checkout();
      await fetchProducts(); // refresh stock
    } catch (error) {
      // error already alerted in context
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="w-96 bg-white border-l p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
      {receipt && (
        <ReceiptModal transaction={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
};
