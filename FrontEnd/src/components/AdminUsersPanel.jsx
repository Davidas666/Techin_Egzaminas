import { useEffect, useState } from 'react';

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState('user');

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
  };

  const handleSave = async (id) => {
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
              <td>{user.username}</td>
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
              <td>
                {editId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)}>Išsaugoti</button>
                    <button onClick={() => setEditId(null)}>Atšaukti</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Keisti rolę</button>
                    <button onClick={() => handleDelete(user.id)}>Trinti</button>
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
