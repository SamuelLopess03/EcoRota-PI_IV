import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Info from './pages/Info';
import Ecoponto from './pages/Ecopontos';
import AdminLogin from './pages/AdminLogin';
import { useEffect } from 'react';

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
}

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import NeighborhoodsList from './pages/admin/NeighborhoodsList';
import NeighborhoodForm from './pages/admin/NeighborhoodForm';
import SubscribersList from './pages/admin/SubscribersList';
import SubscriberForm from './pages/admin/SubscriberForm';
import AdminsList from './pages/admin/AdminsList';
import AdminForm from './pages/admin/AdminForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToHash />
        <div className="App">
          <Header />
          <Navbar />

          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/informacoes" element={<Info />} />
              <Route path="/ecopontos" element={<Ecoponto />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/neighborhoods"
                element={<ProtectedRoute><NeighborhoodsList /></ProtectedRoute>}
              />
              <Route
                path="/admin/neighborhoods/new"
                element={<ProtectedRoute><NeighborhoodForm /></ProtectedRoute>}
              />
              <Route
                path="/admin/neighborhoods/:id/edit"
                element={<ProtectedRoute><NeighborhoodForm /></ProtectedRoute>}
              />
              
              {/* Subscribers */}
              <Route
                path="/admin/subscribers"
                element={<ProtectedRoute><SubscribersList /></ProtectedRoute>}
              />
              <Route
                path="/admin/subscribers/new"
                element={<ProtectedRoute><SubscriberForm /></ProtectedRoute>}
              />

              {/* Admins */}
              <Route
                path="/admin/users"
                element={<ProtectedRoute><AdminsList /></ProtectedRoute>}
              />
              <Route
                path="/admin/users/new"
                element={<ProtectedRoute><AdminForm /></ProtectedRoute>}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
