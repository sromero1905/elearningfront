import React, { useState, ReactNode, FormEvent, ChangeEvent, useEffect } from 'react';
import {
  Mail,
  Calendar,
  Lock,
  Bell,
  UserCircle,
  LogOut,
  Edit,
  Eye,
  EyeOff,
  ChevronDown,
  Settings,
  User,
  Key,
  Globe,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import axios from 'axios';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserData {
  nombre?: string;
  apellido?: string;
  email?: string;
  id?: number;
}

// Interfaz para el estado de alerta
interface AlertState {
  type: 'success' | 'error' | 'info' | null;
  message: string;
}

const Configuration: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('account');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  // Estado para almacenar datos del usuario desde localStorage
  const [userData, setUserData] = useState<UserData>({});
  // Estado para manejar el loading durante el cambio de contraseña
  const [loading, setLoading] = useState<boolean>(false);
  // Estado para mostrar alertas
  const [alert, setAlert] = useState<AlertState>({
    type: null,
    message: ''
  });

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        console.log("Datos del usuario cargados:", parsedUserData);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  }, []);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset alert
    setAlert({
      type: null,
      message: ''
    });
    
    // Validar que las contraseñas coincidan
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Las contraseñas nuevas no coinciden'
      });
      return;
    }

    // Validar que la contraseña tenga al menos 8 caracteres
    if (passwordForm.newPassword.length < 8) {
      setAlert({
        type: 'error',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Obtener la URL base de la API desde las variables de entorno
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337/api';
      
      // Crear instancia de Axios con token de autenticación
      const token = localStorage.getItem('jwt');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Llamar a la API para cambiar la contraseña
      const response = await axios.post(`${API_URL}/user-elearnings/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        userId: userData.id,
      }, { headers });
      
      // Mostrar mensaje de éxito
      setAlert({
        type: 'success',
        message: 'Contraseña actualizada correctamente'
      });
      
      // Limpiar el formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      
      // Mostrar mensaje de error
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al cambiar la contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  // Funciones para obtener información del usuario
  const getUserFullName = () => {
    if (userData.nombre && userData.apellido) {
      return `${userData.nombre} ${userData.apellido}`;
    } else if (userData.nombre) {
      return userData.nombre;
    } else if (userData.email) {
      return userData.email.split('@')[0];
    } else {
      return "Usuario";
    }
  };

  const getUserEmail = () => {
    return userData.email || "sin correo registrado";
  };

  const getUserInitial = () => {
    if (userData.nombre) {
      return userData.nombre.charAt(0);
    } else if (userData.email) {
      return userData.email.charAt(0);
    } else {
      return "U";
    }
  };

  // Componente de alerta
  const Alert = ({ type, message }: AlertState) => {
    if (!type) return null;
    
    return (
      <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
        type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
        type === 'error' ? 'bg-red-900/50 text-red-400 border border-red-800' :
        'bg-blue-900/50 text-blue-400 border border-blue-800'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 mt-0.5" />
        )}
        <span>{message}</span>
      </div>
    );
  };

  const sections = [
    {
      id: 'account',
      title: 'Información Personal',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Detalles de la Cuenta</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nombre Completo</label>
                <div className="bg-slate-900 px-4 py-3 rounded-lg text-white border border-slate-700">
                  {getUserFullName()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Correo Electrónico</label>
                <div className="bg-slate-900 px-4 py-3 rounded-lg text-white border border-slate-700">
                  {getUserEmail()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rol</label>
                <div className="bg-slate-900 px-4 py-3 rounded-lg text-white border border-slate-700">
                  Estudiante
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    },
    {
      id: 'security',
      title: 'Seguridad',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Cambiar Contraseña</h4>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                required
              />
            </div>
            
            {/* Mostrar alerta de éxito o error */}
            <Alert type={alert.type} message={alert.message} />
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium flex items-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>Actualizar Contraseña</>
                )}
              </button>
            </div>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12 flex items-center gap-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-slate-500 to-purple-500 flex items-center justify-center text-white">
              <span className="text-4xl font-bold">{getUserInitial()}</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{getUserFullName()}</h1>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {getUserEmail()}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Miembro desde {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl h-fit">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id 
                      ? 'bg-blue-900 text-white' 
                      : 'text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Active Section Content */}
          <div className="md:col-span-2">
            {sections.find(section => section.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;