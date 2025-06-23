import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Books from './components/Books.jsx';
import MyReservations from './components/MyReservations.jsx';
import AddBook from './components/AddBook.jsx';
import AdminBooksPanel from './components/AdminBooksPanel.jsx';
import AdminUsersPanel from './components/AdminUsersPanel.jsx';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return !!savedUser;
  });
  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.role || 'user';
      } catch {
        return 'user';
      }
    }
    return 'user';
  });
  const [showBooks, setShowBooks] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showUsersPanel, setShowUsersPanel] = useState(false);
  const [reloadBooks, setReloadBooks] = useState(false);
  const navigate = useNavigate();
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setShowLogin(false);
    localStorage.setItem('user', JSON.stringify(user));
    if (user?.role === 'admin') {
      setUserRole('admin');
    } else {
      setUserRole('user');
    }
  };
  const handleRegisterSuccess = (user) => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setUserRole('user');
    if (user) localStorage.setItem('user', JSON.stringify(user));
  };
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/users/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch {}
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <>
      <Header 
        onLoginClick={() => setShowLogin(true)} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
        onEkskursijosClick={path => {
          if (path === '/register') setShowRegister(true);
          else {
            setShowBooks(true);
            setShowMyReservations(false);
            setShowAdminPanel(false);
          }
        }}
        onMyToursClick={() => {
          setShowMyReservations(true);
          setShowBooks(false);
          setShowAdminPanel(false);
        }}
        onAddBook={() => setShowAddBook(true)}
        onAdminBooksPanel={() => {
          setShowAdminPanel(true);
          setShowBooks(false);
          setShowMyReservations(false);
          setShowUsersPanel(false);
        }}
        onManageUsers={() => {
          setShowUsersPanel(true);
          setShowAdminPanel(false);
          setShowBooks(false);
          setShowMyReservations(false);
        }}
      />
      {showLogin && <Login onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} onRegisterSuccess={handleRegisterSuccess} />}
      {showAddBook && <AddBook onClose={() => setShowAddBook(false)} onBookAdded={() => { setShowAddBook(false); setReloadBooks(r => !r); }} />}
      <div className="pt-24">
        {showBooks && <Books reload={reloadBooks} />}
        {showMyReservations && <MyReservations />}
        {showAdminPanel && userRole === 'admin' && <AdminBooksPanel />}
        {showUsersPanel && userRole === 'admin' && <AdminUsersPanel />}
        {!showBooks && !showMyReservations && !showAdminPanel && !showUsersPanel && (
          userRole === 'admin' ? <AdminBooksPanel /> : <Books reload={reloadBooks} />
        )}
      </div>
    </>
  )
}
export default App
