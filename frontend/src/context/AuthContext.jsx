import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const data = res.data;

    localStorage.setItem('token', data.token);

    let role = 'user';
    try {
      const profileRes = await API.get(`/profile/${data.name}`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      role = profileRes.data.user?.roles || 'user';
    } catch (e) {
      role = 'user';
    }

    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: role,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(data.token);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await API.post('/auth/signup', { name, email, password });
    const data = res.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role || 'user',
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(data.token);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
