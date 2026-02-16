import { useState } from 'react';
import axios from 'axios';

function Login(props){
    //Estado para guardar username y password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //Funcion que se ejecuta al hacer click en "Login"
    const handleLogin = async() => {
        setError('');
        setLoading(true);

        try {
            //Hacer peticion a mi API
            const response = await axios.post(
                'https://taskmanager-production-8e05.up.railway.app/auth/login',
                { 
                    username: username,
                    password: password 
                }
            );

            //Si llega aqui el login fue exitoso
            console.log('Login exitoso');
            console.log('Token:', response.data.token);

            //Guardamos el token en el localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            alert('Login exitoso');
            props.onLoginSuccess();
        } catch (err) {
            //Si hay mensajes de error, mostrarlos
            console.error('❌ Error:', err);
            setError('Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      
      <button 
        onClick={handleLogin}
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Cargando...' : 'Login'}
      </button>
    </div>
  );
}

export default Login;