import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineRefresh, HiOutlineBeaker, HiOutlineUsers, HiOutlineUser, HiOutlineLogout, HiOutlineX } from 'react-icons/hi';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid size={20} /> },
    { to: '/admin/orders', label: 'All Orders', icon: <HiOutlineClipboardList size={20} /> },
    { to: '/admin/update-status', label: 'Update Status', icon: <HiOutlineRefresh size={20} /> },
    { to: '/admin/fuels', label: 'Fuels', icon: <HiOutlineBeaker size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <HiOutlineUsers size={20} /> },
    { to: '/admin/profile', label: 'Profile', icon: <HiOutlineUser size={20} /> },
  ];

  return (
    <>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity animate-fade-in"></div>
      )}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-admin-900 text-white flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 py-6 border-b border-admin-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Fuel Order System</h1>
            <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white focus:outline-none">
            <HiOutlineX size={20} />
          </button>
        </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-admin-600 text-white shadow-lg shadow-admin-600/30'
                  : 'text-slate-300 hover:bg-admin-800 hover:text-white'
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-admin-800 hover:text-white transition-all duration-200 w-full"
        >
          <HiOutlineLogout size={20} />
          Logout
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
