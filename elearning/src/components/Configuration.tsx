import React, { useState, ReactNode, FormEvent, ChangeEvent } from 'react';
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
} from 'lucide-react';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  role: string;
}

const Configuration: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('account');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userData: UserData = {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    joinDate: "Enero 2024",
    role: "Estudiante"
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Cambio de contraseña:', passwordForm);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
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
                  {userData.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Correo Electrónico</label>
                <div className="bg-slate-900 px-4 py-3 rounded-lg text-white border border-slate-700">
                  {userData.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rol</label>
                <div className="bg-slate-900 px-4 py-3 rounded-lg text-white border border-slate-700">
                  {userData.role}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Preferencias</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Idioma</label>
                <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Zona Horaria</label>
                <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  <option value="utc-3">America/Buenos_Aires</option>
                  <option value="utc-4">America/Santiago</option>
                </select>
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
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: <Bell className="w-5 h-5" />,
      content: (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Configuración de Notificaciones</h4>
          <div className="space-y-4">
            {[
              { 
                title: 'Notificaciones por Email', 
                description: 'Recibe actualizaciones importantes en tu correo',
                id: 'email-notifications'
              },
              { 
                title: 'Notificaciones Push', 
                description: 'Recibe alertas en tiempo real en tu navegador',
                id: 'push-notifications'
              },
              { 
                title: 'Resumen Semanal', 
                description: 'Recibe un resumen de tu progreso semanal',
                id: 'weekly-summary'
              },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div>
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <span className="text-4xl font-bold">{userData.name.charAt(0)}</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {userData.email}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Miembro desde {userData.joinDate}
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
                      ? 'bg-indigo-600 text-white' 
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