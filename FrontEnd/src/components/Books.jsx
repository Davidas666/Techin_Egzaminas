import { useEffect, useState } from 'react';
import BookCard from './BookCard.jsx';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  const fetchBooks = (categoryId, searchTerm) => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:3000/api/v1/books';
    const params = [];
    if (categoryId) params.push(`category_id=${categoryId}`);
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `?${params.join('&')}`;
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
    fetchBooks(selectedCategory, search);
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchBooks('', '');
  }, []);

  return (
    <div className="pt-0 px-4 mt-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 -mt-8 gap-2 sm:gap-4 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mr-0 sm:mr-4 mb-2 sm:mb-0">Knygos</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ieškoti pagal pavadinimą, autorių ar aprašymą"
          className="border rounded px-3 py-2 flex-1 min-w-0"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-0"
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
