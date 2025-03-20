import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  Clock,
  Calendar,
  BookOpen,
  BarChart3,
  MessageSquare,
  MessagesSquare,
  ExternalLink,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Bell
} from 'lucide-react';

// Interfaces
interface UserData {
  nombre?: string;
  apellido?: string;
  email?: string;
  id?: number;
}

interface Material {
  id: number;
  titulo: string;
  link_drive: string;
  tipo: 'tema' | 'bibliografia' | 'recurso';
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: 'video';
  hasResources: boolean;
  date: string;
  date_raw?: string; // Para guardar la fecha en formato raw para comparaciones
  completed?: boolean;
  locked?: boolean;
  link_zoom?: string;
  materiales?: Material[];
}

interface Module {
  id: number;
  moduleNumber?: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  completed?: boolean;
  locked?: boolean;
  lessons: Lesson[];
}

interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  activo: boolean;
  duracion_total: string;
  modules: Module[];
}

interface Capsula {
  id: number;
  titulo: string;
  descripcion: string;
  link_drive: string;
}

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token JWT del localStorage
const getToken = () => {
  return localStorage.getItem('jwt');
};

// Añadir interceptor para incluir el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Componente Dropdown para el usuario
const UserDropdown = ({ userData, onLogout }: { userData: UserData, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {userData.nombre && userData.apellido 
          ? `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase()
          : <User className="h-5 w-5" />
        }
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0d1526] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700">
            <p className="text-white font-medium">
              {userData.nombre && userData.apellido 
                ? `${userData.nombre} ${userData.apellido}`
                : userData.email?.split('@')[0] || 'Usuario'
              }
            </p>
            <p className="text-gray-400 text-sm truncate">{userData.email}</p>
          </div>
          
          <div className="p-2">
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-lg flex items-center space-x-2 transition-colors">
              <User className="h-4 w-4" />
              <span>Mi perfil</span>
            </button>
            
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-lg flex items-center space-x-2 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </button>
            
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-lg flex items-center space-x-2 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span>Ayuda</span>
            </button>
          </div>
          
          <div className="p-2 border-t border-gray-700">
            <button 
              onClick={onLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-600/20 hover:text-red-300 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal de materiales
interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  lessonTitle: string;
}

const MaterialModal: React.FC<MaterialModalProps> = ({ isOpen, onClose, materials, lessonTitle }) => {
  if (!isOpen) return null;

  const getMaterialTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'tema':
        return <FileText className="h-5 w-5 text-blue-400" />;
      case 'bibliografia':
        return <BookOpen className="h-5 w-5 text-green-400" />;
      case 'recurso':
      default:
        return <Download className="h-5 w-5 text-purple-400" />;
    }
  };

  const getMaterialTypeText = (tipo: string) => {
    switch (tipo) {
      case 'tema':
        return 'Material de clase';
      case 'bibliografia':
        return 'Bibliografía';
      case 'recurso':
      default:
        return 'Recurso adicional';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1526] border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Materiales: {lessonTitle}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {materials.length === 0 ? (
            <p className="text-gray-400">No hay materiales disponibles para esta clase.</p>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="bg-gray-800/70 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      {getMaterialTypeIcon(material.tipo)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{material.titulo}</h4>
                      <p className="text-sm text-gray-300">{getMaterialTypeText(material.tipo)}</p>
                    </div>
                  </div>
                  <a 
                    href={material.link_drive} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Abrir</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 bg-gray-900/80">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de cápsulas
interface CapsulasModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsulas: Capsula[];
  loading: boolean;
  error: string | null;
}

const CapsulasModal: React.FC<CapsulasModalProps> = ({ isOpen, onClose, capsulas, loading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1526] border border-gray-700 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Bibliografía Adicional</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-400">Cargando material bibliográfico...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-400">{error}</p>
            </div>
          ) : capsulas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <BookOpen className="h-16 w-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-center">No hay material bibliográfico adicional disponible.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {capsulas.map((capsula) => (
                <div key={capsula.id} className="bg-gray-800/70 rounded-lg overflow-hidden border border-gray-700/50">
                  <div className="p-5">
                    <h4 className="text-lg font-medium text-white mb-2">{capsula.titulo}</h4>
                    <p className="text-gray-300 text-sm mb-4">{capsula.descripcion}</p>
                    
                    <div className="flex justify-end">
                      <a 
                        href={capsula.link_drive} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Ver material</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 bg-gray-900/80">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseContent: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el modal de materiales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMaterials, setCurrentMaterials] = useState<Material[]>([]);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>('');
  
  // Estado para el modal de cápsulas
  const [capsulas, setCapsulas] = useState<Capsula[]>([]);
  const [isCapsulasModalOpen, setIsCapsulasModalOpen] = useState<boolean>(false);
  const [loadingCapsulas, setLoadingCapsulas] = useState<boolean>(false);
  const [capsulasError, setCapsulasError] = useState<string | null>(null);
  
  // Estado para los dropdowns de módulos
  const [openModules, setOpenModules] = useState<{ [key: number]: boolean }>({});

  // Estados calculados para información del curso
  const [totalDuration, setTotalDuration] = useState<string>("0h");
  const [nextClass, setNextClass] = useState<string>("No hay clases próximamente");
  const [progress, setProgress] = useState<string>("0%");
  
  // Estado para tracking de clases completadas (para la nueva sección de estadísticas)
  const [completedLessons, setCompletedLessons] = useState<string>("0/0");
  const [totalMaterials, setTotalMaterials] = useState<number>(0);
  const [remainingHours, setRemainingHours] = useState<string>("0h 0min");

  // Obtener el ID del curso - En una aplicación real, vendría de parámetros o contexto
  const cursoId = 1;

  // Manejador de cierre de sesión para el dropdown
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  // Función para alternar el estado de desplegado de un módulo
  const toggleModule = (moduleId: number) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Función para calcular la duración total del curso
  const calculateTotalDuration = (modules: Module[]) => {
    let totalMinutes = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        const durationStr = lesson.duration;
        
        // Extraer horas y minutos de los formatos como "1h 30min" o "45min"
        const hoursMatch = durationStr.match(/(\d+)h/);
        const minutesMatch = durationStr.match(/(\d+)min/);
        
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
        
        totalMinutes += (hours * 60) + minutes;
      });
    });
    
    // Convertir de nuevo a formato legible
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    return hours > 0 
      ? mins > 0 ? `${hours}h ${mins}min` : `${hours}h` 
      : `${mins}min`;
  };

  // Función para encontrar la próxima clase
  const findNextClass = (modules: Module[]) => {
    const today = new Date();
    let nextClassDate: Date | null = null;
    let nextClassInfo = "";
    
    modules.forEach(module => {
      if (module.locked) return;
      
      module.lessons.forEach(lesson => {
        if (lesson.locked) return;
        
        // Si hay una fecha en formato raw, usarla para comparación
        if (lesson.date_raw) {
          const lessonDate = new Date(lesson.date_raw);
          
          // Si la fecha de la clase es futura y es anterior a la próxima clase encontrada
          // o no se ha encontrado ninguna próxima clase aún
          if (lessonDate > today && (!nextClassDate || lessonDate < nextClassDate)) {
            nextClassDate = lessonDate;
            nextClassInfo = `${lesson.date} - ${lesson.title}`;
          }
        }
      });
    });
    
    return nextClassInfo || "No hay clases próximamente";
  };

  // Función para calcular el progreso total del curso
  const calculateProgress = (modules: Module[]) => {
    let totalLessons = 0;
    let completedLessons = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lesson.completed) {
          completedLessons++;
        }
      });
    });
    
    if (totalLessons === 0) return "0%";
    
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
    return `${progressPercentage}%`;
  };
  
  // Calcular el número total de materiales
  const calculateTotalMaterials = (modules: Module[]) => {
    let count = 0;
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.materiales) {
          count += lesson.materiales.length;
        }
      });
    });
    return count;
  };
  
  // Calcular las horas restantes
  const calculateRemainingHours = (modules: Module[]) => {
    let totalMinutes = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!lesson.completed) {
          const durationStr = lesson.duration;
          const hoursMatch = durationStr.match(/(\d+)h/);
          const minutesMatch = durationStr.match(/(\d+)min/);
          
          const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
          const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
          
          totalMinutes += (hours * 60) + minutes;
        }
      });
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    return hours > 0 
      ? mins > 0 ? `${hours}h ${mins}min` : `${hours}h` 
      : `${mins}min`;
  };
  
  // Calcular completedLessons como fracción
  const calculateCompletedLessons = (modules: Module[]) => {
    let total = 0;
    let completed = 0;
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        if (lesson.completed) {
          completed++;
        }
      });
    });
    
    return `${completed}/${total}`;
  };const fetchCapsulas = async (): Promise<void> => {
    try {
      setLoadingCapsulas(true);
      setCapsulasError(null);
      
      // Usar la nueva ruta personalizada
      const response = await api.get<Capsula[]>(`/custom-capsulas`, {
        params: {
          cursoId: cursoId,
        }
      });
      
      const capsulasData: Capsula[] = response.data || [];
      setCapsulas(capsulasData);
      setLoadingCapsulas(false);
    } catch (error: any) {
      console.error('Error al cargar las cápsulas:', error);
      
      const errorMessage: string = error.response?.status === 404
        ? 'La ruta de cápsulas no está disponible. Verifica la configuración de Strapi.'
        : 'No se pudieron cargar los materiales bibliográficos adicionales.';
        
      setCapsulasError(errorMessage);
      setCapsulas([]);
      setLoadingCapsulas(false);
    }
  };
  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
    
    // Cargar datos del curso desde la API
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cursos/${cursoId}`);
        const courseData = response.data;
        
        // Calcular valores adicionales
        const duration = calculateTotalDuration(courseData.modules);
        const nextClassInfo = findNextClass(courseData.modules);
        const progressInfo = calculateProgress(courseData.modules);
        const materialsCount = calculateTotalMaterials(courseData.modules);
        const remaining = calculateRemainingHours(courseData.modules);
        const lessonsCount = calculateCompletedLessons(courseData.modules);
        
        setCourse(courseData);
        setTotalDuration(duration);
        setNextClass(nextClassInfo);
        setProgress(progressInfo);
        setTotalMaterials(materialsCount);
        setRemainingHours(remaining);
        setCompletedLessons(lessonsCount);
        
        // Inicializar todos los módulos como desplegados
        const initialOpenState: { [key: number]: boolean } = {};
        courseData.modules.forEach((module: Module, index: number) => {
          // Abrir por defecto solo el primer módulo que no esté completado
          // Usamos index como fallback para asegurar que funcione correctamente
          const isFirstIncomplete = !module.completed && 
            !courseData.modules.slice(0, index).some((m: Module) => !m.completed);
          initialOpenState[module.id] = isFirstIncomplete;
        });
        setOpenModules(initialOpenState);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el curso:', err);
        setError('No se pudo cargar el contenido del curso. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchCourse();
    
    // Cargar las cápsulas
    fetchCapsulas();
  }, [cursoId]);

  // Función para abrir el modal de materiales
  const openMaterialsModal = (lesson: Lesson) => {
    if (lesson.materiales && lesson.materiales.length > 0) {
      setCurrentMaterials(lesson.materiales);
      setCurrentLessonTitle(lesson.title);
      setIsModalOpen(true);
    }
  };
  
  // Funciones para abrir y cerrar el modal de cápsulas
  const openCapsulasModal = () => {
    setIsCapsulasModalOpen(true);
  };

  const closeCapsulasModal = () => {
    setIsCapsulasModalOpen(false);
  };

  const getUserName = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#040b18] via-[#071223] to-[#091632]">
        <div className="text-white">Cargando contenido del curso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#040b18] via-[#071223] to-[#091632]">
        <div className="text-red-400 p-6 bg-gray-800/70 rounded-lg font-medium">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#040b18] via-[#071223] to-[#091632]">
        <div className="text-white p-6 bg-gray-800/70 rounded-lg">
          No se encontró el curso solicitado.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040b18] via-[#071223] to-[#091632]">
      {/* Bienvenida */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          ¡Bienvenido, {getUserName()}! 👋
        </h1>
        <p className="text-blue-400">
          Continúa tu viaje de aprendizaje en {course.titulo}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Dashboard Stats - Con mejores contrastes */}
        <div className="mb-12">
          {/* No encabezado para una vista más limpia */}
          
          {/* Contenedor principal con contraste mejorado y centrado */}
          <div className="bg-[#0d1526] backdrop-blur-lg rounded-2xl border border-gray-800 overflow-hidden shadow-xl shadow-blue-900/10">
            {/* Fila superior con las estadísticas principales - centrado con solo 3 tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-800">
              {/* Tarjeta 1: Progreso Total - Con mejor contraste */}
              <div className="p-6 hover:bg-blue-900/10 transition-all duration-300 group relative overflow-hidden">
                {/* Efecto de destello en hover */}
                <div className="absolute -inset-1 bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
                
                <div className="relative">
                  {/* Header con icono y valor */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Progreso</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{progress}</span>
                  </div>
                  
                  {/* Barra de progreso con mejor contraste */}
                  <div className="mt-2">
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                      {/* Barra de progreso actual */}
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                        style={{ width: progress }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Footer con mensaje motivacional */}
                  <p className="text-xs text-blue-400 mt-3 font-medium">
                    {progress === "100%" ? "¡Felicitaciones!" : "Continúa aprendiendo"}
                  </p>
                </div>
              </div>
              
              {/* Tarjeta 2: Duración Total - Con mejor contraste */}
              <div className="p-6 hover:bg-purple-900/10 transition-all duration-300 group relative overflow-hidden">
                {/* Efecto de destello en hover */}
                <div className="absolute -inset-1 bg-purple-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
                
                <div className="relative">
                  {/* Header con icono */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm text-white font-medium uppercase tracking-wider">Duración</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalDuration}</div>
                  </div>
                  
                  {/* Visualización gráfica de la duración con mejor contraste */}
                  <div className="mt-2 flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => {
                      // Extraer número de horas para determinar el llenado
                      const hourMatch = totalDuration.match(/(\d+)h/);
                      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
                      
                      return (
                        <div 
                          key={i} 
                          className={`h-8 flex-1 rounded-md ${
                            // Diferentes tonos de morado con mejor contraste
                            i < Math.ceil(hours / 4) 
                              ? `bg-gradient-to-b from-purple-500/80 to-purple-600/60` 
                              : `bg-gray-800`
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                  
                  {/* Footer con información adicional ya no es necesario */}
                </div>
              </div>
              
              {/* Tarjeta 3: Próxima Clase - Con mejor contraste */}
              <div className="p-6 hover:bg-green-900/10 transition-all duration-300 group relative overflow-hidden">
                {/* Efecto de destello en hover */}
                <div className="absolute -inset-1 bg-green-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
                
                <div className="relative">
                  {/* Header con icono */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Próxima Clase</span>
                  </div>
                  
                  {/* Información de la próxima clase con mejor formato y contraste */}
                  <div className="mt-2 bg-gray-800 rounded-xl p-3 border border-green-600/10">
                    {nextClass === "No hay clases próximamente" ? (
                      <p className="text-gray-400 text-sm">No hay clases programadas</p>
                    ) : (
                      <>
                        <p className="text-white font-medium mb-1">
                          {nextClass.split('-')[0]?.trim()}
                        </p>
                        <p className="text-green-400 text-sm">
                          {nextClass.split('-')[1]?.trim() || ''}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección inferior con estadísticas adicionales - mejor contraste */}
            <div className="border-t border-gray-800 p-6 bg-gray-900/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Estadística 1: Clases Completadas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">Clases completadas</span>
                  </div>
                  <span className="text-white font-semibold">{completedLessons}</span>
                </div>
                
                {/* Estadística 2: Materiales Disponibles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-white" />
                    <span className="text-gray-300">Materiales disponibles</span>
                  </div>
                  <span className="text-white font-semibold">{totalMaterials}</span>
                </div>
                
                {/* Estadística 3: Horas Restantes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Horas restantes</span>
                  </div>
                  <span className="text-white font-semibold">{remainingHours}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicador de actualización */}
          <div className="mt-2 text-right">
            <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
              <Clock className="h-3 w-3" />
              Actualizado hace 2 horas
            </span>
          </div>
        </div>

        {/* Módulos - Con sistema de dropdown y mejor contraste */}
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div key={module.id} className="bg-[#0d1526] backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
              {/* Cabecera del Módulo (siempre visible) */}
              <div 
                className="p-6 border-b border-gray-800 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                        Módulo {module.moduleNumber || module.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        module.locked 
                          ? 'bg-gray-700/50 text-gray-400'
                          : module.completed 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {module.locked 
                          ? 'Bloqueado'
                          : module.completed 
                            ? 'Completado' 
                            : 'En progreso'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between mt-3">
                      <h2 className="text-xl font-semibold text-white">
                        {module.title}
                      </h2>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        {openModules[module.id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-300 mt-2 pr-8">{module.description}</p>
                    
                    {/* Barra de progreso con mejor contraste */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Progreso del módulo</span>
                        <span className="text-blue-400">{module.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido del módulo (visible solo si está desplegado) */}
              {openModules[module.id] && (
                <>
                  {/* Lista de Lecciones */}
                  <div className="divide-y divide-gray-800">
                    {module.lessons.map((lesson, index) => (
                      <div 
                        key={index}
                        className="p-6 hover:bg-gray-800/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              lesson.locked 
                                ? 'bg-gray-800'
                                : lesson.completed 
                                  ? 'bg-green-600/20' 
                                  : 'bg-blue-600/20'
                            }`}>
                              {lesson.locked ? (
                                <Lock className="h-5 w-5 text-gray-500" />
                              ) : lesson.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              ) : (
                                <PlayCircle className="h-5 w-5 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <h3 className={`font-medium ${lesson.locked ? 'text-gray-500' : 'text-white'}`}>
                                {lesson.title}
                              </h3>
                              {lesson.description && (
                                <p className={`text-sm mt-1 ${lesson.locked ? 'text-gray-600' : 'text-gray-300'}`}>
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="flex items-center text-sm text-gray-400">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {lesson.duration}
                                </span>
                                {lesson.date && (
                                  <span className="flex items-center text-sm text-gray-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {lesson.date}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Acciones de la lección - Simplificadas y con mejor contraste */}
                          <div className="flex items-center space-x-3">
                            {lesson.hasResources && !lesson.locked && (
                              <button 
                                className="p-3 text-gray-300 hover:text-white transition-colors bg-gray-800/70 hover:bg-gray-700/70 rounded-lg"
                                title="Ver materiales de la clase"
                                onClick={() => openMaterialsModal(lesson)}
                              >
                                <FileText className="h-5 w-5" />
                              </button>
                            )}
                            {lesson.link_zoom && !lesson.locked && (
                              <a 
                                href={lesson.link_zoom}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-3 text-blue-300 hover:text-blue-200 transition-colors bg-blue-600/20 hover:bg-blue-600/30 rounded-lg"
                                title="Unirse a la clase por Zoom"
                              >
                                <Video className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer del Módulo - Solo para módulos bloqueados */}
                  {module.locked && (
                    <div className="p-6 bg-gray-900/50 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 text-sm">
                          Complete el módulo anterior para desbloquear este contenido
                        </p>
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
 
       

        {/* Botón para bibliografía adicional */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10 p-8 rounded-2xl border border-gray-800/50 text-center">
          <BookOpen className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Material Bibliográfico Adicional</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Accede a lecturas complementarias, artículos y recursos adicionales para profundizar en los conceptos del curso.
          </p>
          <button
            onClick={openCapsulasModal}
            className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto border border-indigo-500/30"
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Ver bibliografía adicional</span>
          </button>
          
          {loadingCapsulas && (
            <p className="text-gray-400 text-sm mt-4">Cargando datos bibliográficos...</p>
          )}
          
          {capsulasError && (
            <p className="text-red-400 text-sm mt-4">{capsulasError}</p>
          )}
          
          
        </div>

        {/* Soporte Técnico con mejor contraste */}
        <div className="mt-12 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl" />
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 text-center">
            <p className="text-gray-200 font-medium mb-4">
              ¿Necesitas ayuda?
            </p>
            <a 
              href="/help" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         bg-blue-600/20 hover:bg-blue-600/30
                         text-blue-300 text-sm font-medium
                         border border-blue-600/30
                         transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Centro de Ayuda</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de materiales */}
      <MaterialModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        materials={currentMaterials}
        lessonTitle={currentLessonTitle}
      />
      
      {/* Modal de cápsulas bibliográficas */}
      <CapsulasModal 
        isOpen={isCapsulasModalOpen}
        onClose={closeCapsulasModal}
        capsulas={capsulas}
        loading={loadingCapsulas}
        error={capsulasError}
      />
    </div>
  );
};

export default CourseContent;