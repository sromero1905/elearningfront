import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { 
  Bell, 
  User,
  LogOut,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 ${align === 'right' ? 'right-0' : 'left-0'} min-w-[14rem] rounded-lg bg-gray-900 border border-gray-800 shadow-lg`}>
          {children}
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-6">
          {/* Logo y Marca */}
          <div className="flex-1 flex items-center space-x-4">
            <button className="lg:hidden p-2 text-gray-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Logo SVG */}
              <svg className="h-10 w-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="23" className="stroke-blue-500" strokeWidth="2"/>
                <path d="M16 25C16 20.5817 19.5817 17 24 17H26C30.4183 17 34 20.5817 34 25C34 29.4183 30.4183 33 26 33H24C19.5817 33 16 29.4183 16 25Z" fill="#3B82F6"/>
                <path d="M25 16V34" className="stroke-white" strokeWidth="2"/>
              </svg>
              
              <div className="hidden md:block">
                <a href="/home/2">
                  <h1 className="text-white font-semibold text-lg tracking-tight">
                    Negociación Constructiva
                  </h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <p className="text-gray-400 text-sm">Campus Virtual</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Espacio flexible para empujar elementos a la derecha */}
          <div className="flex-1"></div>

          {/* Íconos de la derecha */}
          <div className="flex items-center justify-end space-x-4 ml-4">
            {/* Notificaciones */}
            <Dropdown 
              trigger={
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-gray-900"></span>
                </button>
              }
            >
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-400 font-medium">
                  Notificaciones
                </div>
                <div className="h-px bg-gray-800 my-1"></div>
                <div className="max-h-72 overflow-y-auto p-1">
                  <div className="p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                    <p className="text-sm text-white font-medium">Nuevo contenido disponible</p>
                    <p className="text-xs text-gray-400 mt-1">Se ha añadido nuevo material al Módulo 2</p>
                  </div>
                  <div className="p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                    <p className="text-sm text-white font-medium">Próxima sesión</p>
                    <p className="text-xs text-gray-400 mt-1">Recordatorio: Clase virtual mañana a las 10:00</p>
                  </div>
                </div>
              </div>
            </Dropdown>

            {/* Perfil de Usuario */}
            <Dropdown 
              trigger={
                <button className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </button>
              }
            >
              <div className="py-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-white">Carlos Rodriguez</p>
                  <p className="text-xs text-gray-400">carlos@empresa.com</p>
                </div>
                <div className="h-px bg-gray-800 my-1"></div>
                <a href="/my-profile">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </button>
                </a>
                <a href="/configuration">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </button>
                </a>
                <a href="/help">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Centro de Ayuda</span>
                  </button>
                </a>
                <div className="h-px bg-gray-800 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;