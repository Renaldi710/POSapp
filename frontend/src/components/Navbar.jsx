import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  LogOut,
  User,
  Package,
  ClipboardList,
  Home,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          POS App
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-blue-600"
            title="Dashboard"
          >
            <Home size={20} />
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link
                to="/products"
                className="flex items-center text-gray-600 hover:text-blue-600"
                title="Products"
              >
                <Package size={20} />
              </Link>
              <Link
                to="/categories"
                className="flex items-center text-gray-600 hover:text-blue-600"
                title="Categories"
              >
                <ClipboardList size={20} />
              </Link>
            </>
          )}
          <Link
            to="/pos"
            className="flex items-center text-gray-600 hover:text-blue-600"
            title="POS"
          >
            <ShoppingCart size={20} />
          </Link>
          <Link
            to="/transactions"
            className="flex items-center text-gray-600 hover:text-blue-600"
            title="Transactions"
          >
            <ClipboardList size={20} />
          </Link>
          <div className="flex items-center space-x-2 text-gray-700">
            <User size={20} />
            <span>{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
