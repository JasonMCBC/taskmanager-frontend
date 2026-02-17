import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateTask from './CreateTask';

const API_URL = 'https://taskmanager-production-8e05.up.railway.app';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las tareas');
      setLoading(false);
    }
  };

  // ─── ELIMINAR ────────────────────────────────
  const handleDelete = async (taskId) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta tarea?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Recargar la lista
      loadTasks();
    } catch (err) {
      alert('Error al eliminar la tarea');
    }
  };

  // ─── TOGGLE COMPLETADA ───────────────────────
  const handleToggleComplete = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/tasks/${task.id}`,
        { ...task, completed: !task.completed },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      loadTasks();
    } catch (err) {
      alert('Error al actualizar la tarea');
    }
  };

  // ─── GUARDAR EDICIÓN ─────────────────────────
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/tasks/${editingTask.id}`,
        editingTask,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      alert('Error al editar la tarea');
    }
  };

  if (loading) return <div>Cargando tareas...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Formulario para crear tarea */}
      <CreateTask onTaskCreated={loadTasks} />

      <h2>📋 Mis Tareas ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No tienes tareas todavía. ¡Crea una!</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px',
              backgroundColor: task.completed ? '#f0fff0' : 'white'
            }}
          >
            {/* ─── Modo Edición ─── */}
            {editingTask && editingTask.id === task.id ? (
              <div>
                <input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                />
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  style={{ padding: '8px', marginBottom: '8px' }}
                >
                  <option value="LOW">🟢 Baja</option>
                  <option value="MEDIUM">🟡 Media</option>
                  <option value="HIGH">🔴 Alta</option>
                </select>
                <div>
                  <button onClick={handleSaveEdit} style={{ marginRight: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    💾 Guardar
                  </button>
                  <button onClick={() => setEditingTask(null)} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Modo Vista ─── */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none', margin: 0 }}>
                    {task.title}
                  </h3>
                  <div>
                    <button
                      onClick={() => handleToggleComplete(task)}
                      style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      {task.completed ? '↩️ Reabrir' : '✅ Completar'}
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                <p style={{ color: '#666', margin: '8px 0' }}>{task.description}</p>
                <small>
                  Prioridad: {task.priority === 'HIGH' ? '🔴 Alta' : task.priority === 'MEDIUM' ? '🟡 Media' : '🟢 Baja'} |
                  Estado: {task.completed ? '✅ Completada' : '⏳ Pendiente'}
                </small>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;