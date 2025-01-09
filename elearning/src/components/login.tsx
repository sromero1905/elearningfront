import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Key } from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormState {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

interface LoginProps {
  onLogin?: (credentials: LoginCredentials) => Promise<void>;
  onResetPassword?: (email: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin, onResetPassword }) => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    error: null,
    isLoading: false
  });
  const [isResetMode, setIsResetMode] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      error: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!onLogin) return;

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));
      await onLogin({
        email: formState.email,
        password: formState.password
      });
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar sesión'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!onResetPassword) return;

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));
      await onResetPassword(formState.email);
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al restablecer la contraseña'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0C10] relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(30deg,transparent_70%,rgba(0,68,255,0.1))]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        {/* Header con logo y branding */}
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center justify-center space-x-3">
            
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Negociación Constructiva
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Campus Virtual
              </p>
            </div>
          </div>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        </div>

        {/* Card principal con diseño empresarial */}
        <div className="bg-[#12141A] rounded-2xl shadow-2xl border border-gray-800/50">
          {!isResetMode ? (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white">Acceso al Campus</h2>
                <p className="text-gray-400 text-sm mt-1">Plataforma de Aprendizaje Empresarial</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formState.error && (
                  <div className="p-4 rounded-lg bg-red-900/20 border border-red-800/50 text-red-400 text-sm">
                    {formState.error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="empresa@ejemplo.com"
                      required
                      disabled={formState.isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={formState.isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span>{formState.isLoading ? 'Verificando...' : 'Ingresar a la plataforma'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsResetMode(true)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  disabled={formState.isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white">Recuperar contraseña</h2>
                <p className="text-gray-400 text-sm mt-1">Recibirás un correo con las instrucciones</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      id="reset-email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="empresa@ejemplo.com"
                      required
                      disabled={formState.isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  {formState.isLoading ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsResetMode(false)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  disabled={formState.isLoading}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Soporte técnico:{' '}
            <a 
              href="mailto:soporte@negociacionconstructiva.com" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              soporte@negociacionconstructiva.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;