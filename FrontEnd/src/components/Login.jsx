import { useState } from 'react';

export default function Login({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Prisijungimo klaida');
        return;
      }
      const user = data?.data?.user;
      if (!user) {
        setError('Neteisingas serverio atsakymas');
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setError('Serverio klaida: ' + (err?.message || '')); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="card rounded-lg shadow-lg w-full max-w-xs p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Prisijungti</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]">Prisijungti</button>
          <button type="button" onClick={onClose} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)', border: '2px solid var(--color-yellow)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-yellow)] hover:text-[color:var(--color-orange)]">Uždaryti</button>
        </form>
      </div>
    </div>
  );
}
