import { useNavigate } from 'react-router-dom';
import { User, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="  bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center md">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">Finance ERP</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={() => toast.info('Notifications feature not implemented yet')}

              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </motion.button>

            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info('User profile feature not implemented yet')}
  
                className="flex cursor-pointer items-center space-x-2 rounded-full bg-gray-100 p-2 text-sm"
              >
                <User className="h-5 w-5 text-gray-600" />
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10, pointerEvents: 'none' }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  pointerEvents: 'auto',
                  transition: { delay: 0.1 }
                }}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;