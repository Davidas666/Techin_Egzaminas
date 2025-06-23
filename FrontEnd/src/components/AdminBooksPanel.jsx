import { useEffect, useState } from 'react';

export default function AdminBooksPanel() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editBookId, setEditBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [catError, setCatError] = useState('');

  // Fetch books and categories
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [booksRes, catRes] = await Promise.all([
        fetch('http://localhost:3000/api/v1/books'),
        fetch('http://localhost:3000/api/v1/categories')
      ]);
      const booksData = await booksRes.json();
      const catData = await catRes.json();
      setBooks(booksData.data || []);
      setCategories(catData.data || []);
    } catch {
      setError('Nepavyko užkrauti duomenų');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Delete book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Ar tikrai trinti šią knygą?')) return;
    await fetch(`http://localhost:3000/api/v1/books/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchAll();
  };

  // Edit book
  const handleEditBook = (book) => {
    setEditBookId(book.id);
    setEditBookData({ ...book });
  };
  const handleEditChange = (e) => {
    setEditBookData({ ...editBookData, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = async () => {
    await fetch(`http://localhost:3000/api/v1/books/${editBookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editBookData)
    });
    setEditBookId(null);
    setEditBookData({});
    fetchAll();
  };

  // Category add/delete
  const handleAddCategory = async () => {
    setCatError('');
    if (!newCategory.trim()) return setCatError('Įveskite pavadinimą');
    await fetch('http://localhost:3000/api/v1/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newCategory })
    });
    setNewCategory('');
    fetchAll();
  };
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Ar tikrai trinti šią kategoriją?')) return;
    await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchAll();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Knygų valdymas</h2>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th>Pavadinimas</th>
            <th>Autorius</th>
            <th>Aprašymas</th>
            <th>ISBN</th>
            <th>Paveikslėlis</th>
            <th>Išleidimo data</th>
            <th>Kategorija</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} className="border-b">
              {editBookId === book.id ? (
                <>
                  <td><input name="title" value={editBookData.title || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td><input name="author" value={editBookData.author || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td><textarea name="description" value={editBookData.description || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td><input name="isbn" value={editBookData.isbn || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td><input name="image_url" value={editBookData.image_url || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td><input name="published_date" type="date" value={editBookData.published_date || ''} onChange={handleEditChange} className="border px-2" /></td>
                  <td>
                    <select name="category_id" value={editBookData.category_id || ''} onChange={handleEditChange} className="border px-2">
                      <option value="">-</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSaveEdit} className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1 rounded mr-2 transition">Išsaugoti</button>
                    <button onClick={() => setEditBookId(null)} className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1 rounded transition">Atšaukti</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td className="max-w-xs whitespace-pre-line break-words">{book.description}</td>
                  <td>{book.isbn}</td>
                  <td>{book.image_url && <img src={book.image_url} alt="cover" className="w-16 h-16 object-cover" />}</td>
                  <td>{book.published_date}</td>
                  <td>{categories.find(c => c.id === book.category_id)?.name || '-'}</td>
                  <td>
                    <button onClick={() => handleEditBook(book)} className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1 rounded mr-2 transition">Redaguoti</button>
                    <button onClick={() => handleDeleteBook(book.id)} className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1 rounded transition">Trinti</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Kategorijos</h3>
        <div className="flex gap-2 mb-2">
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nauja kategorija" className="border px-2 py-1" />
          <button onClick={handleAddCategory} className="bg-black hover:bg-gray-900 text-white font-bold px-3 py-1 rounded transition">Pridėti</button>
        </div>
        {catError && <div className="text-red-500 mb-2">{catError}</div>}
        <ul>
          {categories.map(cat => (
            <li key={cat.id} className="flex items-center gap-2 mb-1">
              <span>{cat.name}</span>
              <button onClick={() => handleDeleteCategory(cat.id)} className="bg-black hover:bg-gray-900 text-white font-bold px-2 py-1 rounded text-xs transition">Trinti</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
