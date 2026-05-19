import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store/store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import Home from './pages/Home';
import ItemDetailPage from './pages/ItemDetailPage';
import PostItemPage from './pages/PostItemPage';
import EditItemPage from './pages/EditItemPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function AppContent() {
  const user = useSelector(state => state.auth?.user);

  return (
    <Router>
      <Navbar />
      <NotificationToast />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/post-item"
            element={
              <ProtectedRoute>
                <PostItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
