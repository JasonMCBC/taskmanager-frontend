import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>TaskManager</h1>

      {isLoggedIn ? (
        // ─── Usuario Logueado ───
        <div>
          <div style={{ textAlign: 'right', padding: '0 20px' }}>
            <span style={{ marginRight: '15px', color: '#666' }}>
              👤 {localStorage.getItem('username')}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
          <TaskList />
        </div>

      ) : showRegister ? (
        // ─── Formulario de Registro ───
        <Register onRegisterSuccess={() => setShowRegister(false)} />

      ) : (
        // ─── Formulario de Login ───
        <div>
          <Login onLoginSuccess={handleLoginSuccess} />
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p>¿No tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '16px'
                }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;