import { useState } from 'react';

export default function Register({ onClose, onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('El. paštas turi turėti @');
      return;
    }
    if (password.length < 5) {
      setError('Slaptažodis turi būti bent 5 simbolių');
      return;
    }
    if (password !== passwordconfirm) {
      setError('Slaptažodžiai nesutampa');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, passwordconfirm })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registracijos klaida');
        return;
      }
      if (data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      if (onRegisterSuccess) onRegisterSuccess(data.data.user);
    } catch (err) {
      setError('Serverio klaida: ' + (err?.message || ''));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="card rounded-lg shadow-lg w-full max-w-xs p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Registruotis</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Vartotojo vardas"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-[color:var(--color-brown)]"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="El. paštas"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-[color:var(--color-brown)]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Slaptažodis"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-[color:var(--color-brown)]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Pakartokite slaptažodį"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-[color:var(--color-brown)]"
            value={passwordconfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]">Registruotis</button>
          <button type="button" onClick={onClose} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)', border: '2px solid var(--color-yellow)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-yellow)] hover:text-[color:var(--color-orange)]">Uždaryti</button>
        </form>
      </div>
    </div>
  );
}
