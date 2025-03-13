import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Key, Building2 } from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginState {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

const Login: React.FC = () => {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    error: null,
    isLoading: false
  });
  const [isResetMode, setIsResetMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value,
      error: null
    }));
  };
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_TOKEN = process.env.REACT_APP_API_TOKEN || '';
    
    console.log('Intentando login con:', {
      email: state.email,
      passwordLength: state.password.length
    });
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('http://localhost:1337/api/user-elearnings/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({ 
          email: state.email,
          password: state.password
        })
      });
  
      console.log('Respuesta recibida, status:', response.status);
      const responseText = await response.text();
      console.log('Respuesta como texto:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Respuesta parseada:', responseData);
      } catch (parseError) {
        console.error('Error al parsear respuesta JSON:', parseError);
        throw new Error('Respuesta no válida del servidor');
      }
  
      if (!response.ok) {
        console.error('Error del servidor:', responseData);
        throw new Error(responseData.error?.message || 'Error al iniciar sesión');
      }
  
      console.log('Login exitoso, token recibido:', !!responseData.token);
      
      // Guardar token y datos de usuario
      localStorage.setItem('userToken', responseData.token);
      localStorage.setItem('userData', JSON.stringify(responseData.user));
  
      
      window.location.href = '/home/2';
  
    } catch (error) {
      console.error('Error detallado de login:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Credenciales inválidas'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('http://localhost:1337/api/user-elearnings/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setState(prev => ({
        ...prev,
        error: 'Se han enviado instrucciones para restablecer la contraseña'
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al restablecer la contraseña'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(0,68,255,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(0,68,255,0.05)_0%,transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/20">
              <Building2 className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Negociación Colaborativa
              </h1>
              <div className="h-px w-32 mx-auto my-4 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <p className="text-gray-400 text-sm">
                Portal de Aprendizaje Ejecutivo
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50">
          {!isResetMode ? (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white">Acceso Corporativo</h2>
                <p className="text-gray-400 text-sm mt-2">Ingrese sus credenciales institucionales</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {state.error && (
                  <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
                    {state.error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={state.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="correo@empresa.com"
                      required
                      disabled={state.isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={state.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={state.isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>{state.isLoading ? 'Verificando credenciales...' : 'Iniciar sesión'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsResetMode(true)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  disabled={state.isLoading}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white">Recuperar acceso</h2>
                <p className="text-gray-400 text-sm mt-2">Se le enviará un correo con las instrucciones</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {state.error && (
                  <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
                    {state.error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300">
                    Correo electrónico corporativo
                  </label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      id="reset-email"
                      name="email"
                      value={state.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="correo@empresa.com"
                      required
                      disabled={state.isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200"
                >
                  {state.isLoading ? 'Enviando instrucciones...' : 'Recuperar contraseña'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsResetMode(false)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  disabled={state.isLoading}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Soporte técnico:{' '}
            <a 
              href="mailto:soporte@negociacioncolaborativa.com" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              soporte@negociacioncolaborativa.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;