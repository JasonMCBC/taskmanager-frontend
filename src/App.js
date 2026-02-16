import { useState } from 'react';
import Login from './components/Login';
import TaskList from './components/TaskList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Verificar si hay un token guardado
  useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
        <div>
          <button 
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px 20px'
            }}
          >
            Logout
          </button>
          <TaskList />
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;