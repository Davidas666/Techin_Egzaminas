import { useEffect, useState } from 'react';
import BookCard from './BookCard.jsx';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/v1/books');
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Nepavyko gauti knygų');
          setBooks([]);
        } else {
          setBooks(data.data || []);
        }
      } catch {
        setError('Serverio klaida');
        setBooks([]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <div className="pt-0 px-4 mt-0">
      <div className="flex items-center mb-4 -mt-8">
        <h1 className="text-2xl font-bold mr-4">Knygos</h1>
      </div>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book, idx) => (
          <BookCard key={book.id || idx} book={book} userRole="guest" />
        ))}
      </div>
    </div>
  );
}
