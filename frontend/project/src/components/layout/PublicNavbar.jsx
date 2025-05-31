import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

const PublicNavbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white"
              >
                <DollarSign className="h-5 w-5" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900">FinanceERP</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
            )}
            {location.pathname !== '/register' && (
              <Link
                to="/register"
                className="rounded-md border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;