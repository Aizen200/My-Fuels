import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserDashboard from './pages/user/UserDashboard';
import CreateOrder from './pages/user/CreateOrder';
import OrderHistory from './pages/user/OrderHistory';
import UserProfile from './pages/user/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllOrders from './pages/admin/AllOrders';
import UpdateOrderStatus from './pages/admin/UpdateOrderStatus';
import FuelManagement from './pages/admin/FuelManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  const { user, token } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />
      <Routes>
        <Route path="/login" element={(token && user) ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <Login />} />
        <Route path="/signup" element={(token && user) ? <Navigate to="/dashboard" /> : <Signup />} />

        <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AllOrders />} />
          <Route path="/admin/update-status" element={<UpdateOrderStatus />} />
          <Route path="/admin/update-status/:id" element={<UpdateOrderStatus />} />
          <Route path="/admin/fuels" element={<FuelManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
