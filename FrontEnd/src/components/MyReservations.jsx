import { useEffect, useState } from 'react';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/v1/reservations/my', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Nepavyko gauti rezervacijų');
          setReservations([]);
        } else {
          setReservations(data.data || []);
        }
      } catch {
        setError('Serverio klaida');
        setReservations([]);
      }
      setLoading(false);
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai norite atšaukti šią rezervaciją?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/reservations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r.id !== id));
      }
    } catch {}
  };

  return (
    <div className="pt-0 px-4 mt-0">
      <h1 className="text-2xl font-bold mb-4">Mano rezervacijos</h1>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reservations.map((r, idx) => (
          <div key={r.id || idx} className="card p-4 rounded shadow flex flex-col gap-2">
            <div className="font-bold text-lg text-[color:var(--color-blue)]">{r.title}</div>
            <div className="text-sm text-[color:var(--color-brown)]">Autorius: {r.author}</div>
            {r.image_url && <img src={r.image_url} alt={r.title} className="w-full h-32 object-cover rounded" />}
            <div className="text-sm">ISBN: {r.isbn}</div>
            <div className="text-sm">{r.description}</div>
            <div><b>Rezervacijos data:</b> {r.reservation_date}</div>
            {r.status && <div><b>Statusas:</b> {r.status}</div>}
            <button onClick={() => handleDelete(r.id)} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)'}} className="mt-2 rounded px-4 py-2 border border-[color:var(--color-brown)] hover:bg-[color:var(--color-yellow)] transition">Atšaukti rezervaciją</button>
          </div>
        ))}
      </div>
      {!loading && reservations.length === 0 && !error && <div>Rezervacijų nerasta.</div>}
    </div>
  );
}
