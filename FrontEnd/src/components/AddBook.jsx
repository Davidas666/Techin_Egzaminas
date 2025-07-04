import { useState, useEffect } from 'react';

export default function AddBook({ onClose, onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  const validate = () => {
    if (!title.trim() || !author.trim()) return 'Pavadinimas ir autorius privalomi';
    if (isbn && (isbn.length < 10 || isbn.length > 13)) return 'ISBN turi būti 10-13 simbolių';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          author,
          isbn,
          description,
          image_url: imageUrl,
          category_id: categoryId // pridėta kategorija
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Nepavyko pridėti knygos');
      } else {
        setSuccess('Knyga sėkmingai pridėta!');
        setTitle(''); setAuthor(''); setIsbn(''); setDescription(''); setImageUrl(''); setCategoryId('');
        if (onBookAdded) onBookAdded();
      }
    } catch (err) {
      setError('Serverio klaida');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="card rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Pridėti knygą</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Pavadinimas" value={title} onChange={e => setTitle(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" required />
          <input type="text" placeholder="Autorius" value={author} onChange={e => setAuthor(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" required />
          <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" />
          <input type="text" placeholder="Paveikslėlio nuoroda" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" />
          <textarea placeholder="Aprašymas" value={description} onChange={e => setDescription(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" />
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border rounded px-3 py-2 bg-white text-[color:var(--color-brown)]" required>
            <option value="">Pasirinkite kategoriją</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]" disabled={loading}>{loading ? 'Pridedama...' : 'Pridėti'}</button>
          <button type="button" onClick={onClose} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)', border: '2px solid var(--color-yellow)'}} className="rounded px-4 py-2 font-bold transition hover:bg-[color:var(--color-yellow)] hover:text-[color:var(--color-orange)]">Uždaryti</button>
        </form>
      </div>
    </div>
  );
}
