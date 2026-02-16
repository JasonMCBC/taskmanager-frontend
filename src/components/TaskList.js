import { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar tareas cuando el componente se monta
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // Obtener el token guardado
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      // Hacer petición GET a la API
      const response = await axios.get(
        'https://taskmanager-production-8e05.up.railway.app/tasks',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Tareas recibidas:', response.data);
      setTasks(response.data);
      setLoading(false);

    } catch (err) {
      console.error('Error al cargar tareas:', err);
      setError('Error al cargar las tareas');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando tareas...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Mis Tareas</h2>
      
      {tasks.length === 0 ? (
        <p>No tienes tareas todavía</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <div 
              key={task.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px'
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Prioridad:</strong> {task.priority} | 
                <strong> Estado:</strong> {task.completed ? '✅ Completada' : '⏳ Pendiente'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;