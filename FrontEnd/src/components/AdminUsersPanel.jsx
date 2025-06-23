import { useEffect, useState } from 'react';

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editUsername, setEditUsername] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/users', {
        credentials: 'include',
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      setError('Nepavyko gauti vartotojų');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai trinti šį vartotoją?')) return;
    await fetch(`http://localhost:3000/api/v1/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditRole(user.role);
    setEditUsername(user.username);
  };

  const handleSave = async (id) => {
    // Pakeisti username jei buvo pakeistas
    if (editUsername.trim() !== users.find(u => u.id === id)?.username) {
      await fetch(`http://localhost:3000/api/v1/users/${id}/username`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: editUsername })
      });
    }
    // Pakeisti rolę jei buvo pakeista
    await fetch(`http://localhost:3000/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: editRole })
    });
    setEditId(null);
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vartotojų valdymas</h2>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Vardas</th>
            <th>El. paštas</th>
            <th>Rolė</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td>{user.id}</td>
              <td>
                {editId === user.id ? (
                  <input value={editUsername} onChange={e => setEditUsername(e.target.value)} className="border px-2" />
                ) : (
                  user.username
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editId === user.id ? (
                  <select value={editRole} onChange={e => setEditRole(e.target.value)} className="border px-2">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="flex flex-col sm:flex-row gap-2 py-2">
                {editId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)} style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)'}} className="rounded px-3 py-1 font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]">Išsaugoti</button>
                    <button onClick={() => setEditId(null)} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)', border: '2px solid var(--color-yellow)'}} className="rounded px-3 py-1 font-bold transition hover:bg-[color:var(--color-yellow)] hover:text-[color:var(--color-orange)]">Atšaukti</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)} style={{backgroundColor: 'var(--color-yellow)', color: 'var(--color-brown)', border: '2px solid var(--color-orange)'}} className="rounded px-3 py-1 font-bold transition hover:bg-[color:var(--color-orange)] hover:text-[color:var(--color-yellow)]">Keisti duomenis</button>
                    <button onClick={() => handleDelete(user.id)} style={{backgroundColor: 'var(--color-orange)', color: 'var(--color-brown)', border: '2px solid var(--color-yellow)'}} className="rounded px-3 py-1 font-bold transition hover:bg-[color:var(--color-yellow)] hover:text-[color:var(--color-orange)]">Trinti</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
