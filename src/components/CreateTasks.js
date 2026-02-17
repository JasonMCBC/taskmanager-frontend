import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://taskmanager-production-8e05.up.railway.app';

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    // Validación básica
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${API_URL}/tasks`,
        {
          title: title,
          description: description,
          priority: priority,
          completed: false
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');

      // Avisar al padre que se creó una tarea
      onTaskCreated();

    } catch (err) {
      setError('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>➕ Nueva Tarea</h3>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Título *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', height: '80px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="LOW">🟢 Baja</option>
          <option value="MEDIUM">🟡 Media</option>
          <option value="HIGH">🔴 Alta</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creando...' : 'Crear Tarea'}
      </button>
    </div>
  );
}

export default CreateTask;