import { useEffect, useState } from 'react';
import BookCard from './BookCard.jsx';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  const fetchBooks = (categoryId) => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:3000/api/v1/books';
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBooks(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Serverio klaida');
        setBooks([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchBooks('');
  }, []);

  return (
    <div className="pt-0 px-4 mt-0">
      <div className="flex items-center mb-4 -mt-8 gap-4">
        <h1 className="text-2xl font-bold mr-4">Knygos</h1>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Visos kategorijos</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book, idx) => (
          <BookCard key={book.id || idx} book={book} userRole="guest" />
        ))}
      </div>
      {!loading && books.length === 0 && <div>Nėra knygų šioje kategorijoje.</div>}
    </div>
  );
}
