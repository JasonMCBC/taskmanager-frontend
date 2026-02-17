import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://taskmanager-production-8e05.up.railway.app';

function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    // Validaciones en el frontend
    if (!username.trim()) {
      setError('El username es obligatorio');
      return;
    }
    if (username.length < 3) {
      setError('El username debe tener al menos 3 caracteres');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: username,
        password: password
      });

      // Registro exitoso
      alert(`¡Usuario ${username} creado correctamente! Ahora puedes hacer login.`);
      onRegisterSuccess();

    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ese username ya está en uso');
      } else {
        setError('Error al registrar. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>📝 Crear Cuenta</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Username (mínimo 3 caracteres)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <button
        onClick={onRegisterSuccess}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'transparent',
          color: '#007bff',
          border: '1px solid #007bff',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Volver al Login
      </button>
    </div>
  );
}

export default Register;