import { useState } from 'react';

export default function BookCard({ book }) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReserve = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId: book.id })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Rezervacija nepavyko');
      } else {
        setMessage('Rezervacija sėkminga!');
        setShowForm(false);
      }
    } catch (err) {
      setMessage('Serverio klaida');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto min-h-[350px] transition-all duration-300">
      <h2 className="text-lg font-bold text-blue-700 break-words">{book.title}</h2>
      <div className="text-gray-600 break-words line-clamp-4">{book.description}</div>
      <div className="flex flex-wrap gap-2 text-sm mt-2">
        {book.author && <span className="bg-blue-100 text-[color:var(--color-blue)] px-2 py-1 rounded max-w-full break-words">Autorius: {book.author}</span>}
        {book.isbn && <span className="bg-yellow-100 text-[color:var(--color-orange)] px-2 py-1 rounded max-w-full break-words">ISBN: {book.isbn}</span>}
      </div>
      {book.image_url && <img src={book.image_url} alt={book.title} className="w-full h-32 sm:h-40 md:h-48 object-cover rounded mt-2" />}
      {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
      {showForm ? (
        <form onSubmit={handleReserve} className="flex flex-col gap-2 mt-2">
          <button type="submit" style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)'}} className="rounded px-4 py-2 border border-[color:var(--color-brown)] hover:bg-[color:var(--color-yellow)] transition" disabled={loading}>
            {loading ? 'Rezervuojama...' : 'Patvirtinti rezervaciją'}
          </button>
          <button type="button" style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)'}} className="rounded px-4 py-2 border border-[color:var(--color-brown)] hover:bg-[color:var(--color-orange)] transition" onClick={() => setShowForm(false)}>Atšaukti</button>
        </form>
      ) : (
        <button style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)'}} className="mt-4 rounded px-4 py-2 border border-[color:var(--color-brown)] hover:bg-[color:var(--color-orange)] transition w-full" onClick={() => setShowForm(true)}>
          Rezervuoti
        </button>
      )}
    </div>
  );
}
