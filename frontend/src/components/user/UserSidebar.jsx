import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineViewGrid, HiOutlinePlusCircle, HiOutlineClock, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

const UserSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid size={20} /> },
    { to: '/create-order', label: 'Create Order', icon: <HiOutlinePlusCircle size={20} /> },
    { to: '/order-history', label: 'Order History', icon: <HiOutlineClock size={20} /> },
    { to: '/profile', label: 'Profile', icon: <HiOutlineUser size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-user-900 text-white flex flex-col z-50">
      <div className="px-6 py-6 border-b border-user-800">
        <h1 className="text-xl font-bold tracking-tight">Fuel Order System</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-user-600 text-white shadow-lg shadow-user-600/30'
                  : 'text-slate-300 hover:bg-user-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-user-800 hover:text-white transition-all duration-200 w-full"
        >
          <HiOutlineLogout size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
