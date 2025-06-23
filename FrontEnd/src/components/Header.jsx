import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Header({ onLoginClick, isLoggedIn, onLogout, onEkskursijosClick, onMyToursClick, userRole, onAddBook, onManageUsers, onAdminBooksPanel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleEkskursijosClick = () => {
    onEkskursijosClick('/books');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md flex items-center justify-between px-4 sm:px-8 py-4">
      <div className="text-2xl font-bold text-blue-600">Biblioteka</div>
      <button className="sm:hidden flex flex-col justify-center items-center w-10 h-10" onClick={() => setMenuOpen(m => !m)} aria-label="Meniu">
        <span className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-blue-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      <nav className={`flex-col sm:flex-row flex gap-4 absolute sm:static top-full left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-md sm:shadow-none transition-all duration-200 ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
        <button
          style={isLoggedIn && userRole === 'admin' ? { display: 'none' } : { backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
          className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
          onClick={handleEkskursijosClick}
        >
          Knygos
        </button>
        {isLoggedIn && userRole === 'user' && (
          <button
            style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
            className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
            onClick={onMyToursClick}
          >
            Mano knygos
          </button>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <>
            <button
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
              className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
              onClick={() => onAddBook && onAddBook()}
            >
              Pridėti knygą
            </button>
            <button
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
              className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
              onClick={() => onAdminBooksPanel && onAdminBooksPanel()}
            >
              Knygų valdymas
            </button>
            <button
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
              className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
              onClick={() => onManageUsers && onManageUsers()}
            >
              Valdyti naudotojus
            </button>
          </>
        )}
        {isLoggedIn ? (
          <button
            style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
            className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
            onClick={onLogout}
          >
            Atsijungti
          </button>
        ) : (
          <>
            <button
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
              className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
              onClick={onLoginClick}
            >
              Prisijungti
            </button>
            <button
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)' }}
              className="px-4 py-2 rounded font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]"
              onClick={() => onEkskursijosClick('/register')}
            >
              Registruotis
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  onLoginClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
  onEkskursijosClick: PropTypes.func,
  onMyToursClick: PropTypes.func,
  userRole: PropTypes.string,
  onAddBook: PropTypes.func,
  onManageUsers: PropTypes.func,
  onAdminBooksPanel: PropTypes.func,
};
