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
  ChevronUp
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
      <div className="bg-[#111827] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
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
                <div key={material.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      {getMaterialTypeIcon(material.tipo)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{material.titulo}</h4>
                      <p className="text-sm text-gray-400">{getMaterialTypeText(material.tipo)}</p>
                    </div>
                  </div>
                  <a 
                    href={material.link_drive} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Abrir</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
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
  
  // Estado para los dropdowns de módulos
  const [openModules, setOpenModules] = useState<{ [key: number]: boolean }>({});

  // Estados calculados para información del curso
  const [totalDuration, setTotalDuration] = useState<string>("0h");
  const [nextClass, setNextClass] = useState<string>("No hay clases próximamente");
  const [progress, setProgress] = useState<string>("0%");

  // Obtener el ID del curso - En una aplicación real, vendría de parámetros o contexto
  const cursoId = 1;

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
        
        setCourse(courseData);
        setTotalDuration(duration);
        setNextClass(nextClassInfo);
        setProgress(progressInfo);
        
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
  }, [cursoId]);

  // Función para abrir el modal de materiales
  const openMaterialsModal = (lesson: Lesson) => {
    if (lesson.materiales && lesson.materiales.length > 0) {
      setCurrentMaterials(lesson.materiales);
      setCurrentLessonTitle(lesson.title);
      setIsModalOpen(true);
    }
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0D1729] to-[#0F1C33]">
        <div className="text-white">Cargando contenido del curso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0D1729] to-[#0F1C33]">
        <div className="text-red-500 p-6 bg-gray-800/50 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0D1729] to-[#0F1C33]">
        <div className="text-white p-6 bg-gray-800/50 rounded-lg">
          No se encontró el curso solicitado.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0D1729] to-[#0F1C33]">
      {/* Header con Bienvenida */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido, {getUserName()}! 👋
              </h1>
              <p className="text-blue-400/80">
                Continúa tu viaje de aprendizaje en {course.titulo}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Stats - Versión mejorada y más elegante */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Tarjeta 1: Progreso Total */}
          <div className="bg-gradient-to-br from-[#162039] to-[#1e293b] backdrop-blur-md border border-blue-800/30 rounded-2xl p-6 shadow-lg shadow-blue-900/10 overflow-hidden relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div className="text-white mb-4 bg-gradient-to-br from-blue-500/20 to-blue-700/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-blue-400">{progress}</span>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Progreso Total</p>
              <div className="mt-3 bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: progress }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Tarjeta 2: Duración Total */}
          <div className="bg-gradient-to-br from-[#162039] to-[#1e293b] backdrop-blur-md border border-purple-800/30 rounded-2xl p-6 shadow-lg shadow-purple-900/10 overflow-hidden relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div className="text-white mb-4 bg-gradient-to-br from-purple-500/20 to-purple-700/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-3xl font-bold text-purple-400">{totalDuration}</span>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Duración Total</p>
              <p className="text-xs text-purple-400/80 mt-3 font-medium">Contenido de calidad</p>
            </div>
          </div>
          
          {/* Tarjeta 3: Próxima Clase */}
          <div className="bg-gradient-to-br from-[#162039] to-[#1e293b] backdrop-blur-md border border-green-800/30 rounded-2xl p-6 shadow-lg shadow-green-900/10 overflow-hidden relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div className="text-white mb-4 bg-gradient-to-br from-green-500/20 to-green-700/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <MessagesSquare className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Próxima Clase</p>
              <div className="mt-2">
                <p className="text-xl font-semibold text-white truncate">
                  {nextClass.length > 25 ? nextClass.substring(0, 25) + "..." : nextClass}
                </p>
                {nextClass.length > 25 && (
                  <p className="text-xs text-green-300/80 mt-1 truncate">
                    {nextClass}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Tarjeta 4: Certificación */}
          <div className="bg-gradient-to-br from-[#162039] to-[#1e293b] backdrop-blur-md border border-amber-800/30 rounded-2xl p-6 shadow-lg shadow-amber-900/10 overflow-hidden relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative">
              <div className="flex justify-between items-start">
                <div className="text-white mb-4 bg-gradient-to-br from-amber-500/20 to-amber-700/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-amber-400" />
                </div>
                <span className="text-lg font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {progress === "100%" ? "Completado" : "En progreso"}
                </span>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Certificación</p>
              <p className="text-xs text-amber-400/80 mt-3 font-medium">
                {progress === "100%" ? "¡Felicidades!" : "Continúa avanzando"}
              </p>
            </div>
          </div>
        </div>

        {/* Módulos - Con sistema de dropdown */}
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div key={module.id} className="bg-[#111827]/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
              {/* Cabecera del Módulo (siempre visible) */}
              <div 
                className="p-6 border-b border-gray-800/50 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
                        Módulo {module.moduleNumber || module.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        module.locked 
                          ? 'bg-gray-500/10 text-gray-400'
                          : module.completed 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-blue-500/10 text-blue-400'
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
                    <p className="text-gray-400 mt-2 pr-8">{module.description}</p>
                    
                    {/* Barra de progreso */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progreso del módulo</span>
                        <span className="text-blue-400">{module.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-800/50 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
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
                  <div className="divide-y divide-gray-800/50">
                    {module.lessons.map((lesson, index) => (
                      <div 
                        key={index}
                        className="p-6 hover:bg-gray-800/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              lesson.locked 
                                ? 'bg-gray-800/50'
                                : lesson.completed 
                                  ? 'bg-green-500/10' 
                                  : 'bg-blue-500/10'
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
                                <p className={`text-sm mt-1 ${lesson.locked ? 'text-gray-600' : 'text-gray-400'}`}>
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {lesson.duration}
                                </span>
                                {lesson.date && (
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {lesson.date}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Acciones de la lección - Simplificadas */}
                          <div className="flex items-center space-x-3">
                            {lesson.hasResources && !lesson.locked && (
                              <button 
                                className="p-3 text-gray-400 hover:text-white transition-colors bg-gray-800/30 hover:bg-gray-700/50 rounded-lg"
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
                                className="p-3 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 rounded-lg"
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
                    <div className="p-6 bg-gray-900/30 border-t border-gray-800/50">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">
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

        {/* Footer Informativo */}
        <div className="mt-12 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Video className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Acceso ilimitado al contenido
              </h3>
              <p className="text-gray-400">
                Todas las clases quedan grabadas y disponibles permanentemente en la plataforma. 
                Accede al material complementario y recursos adicionales cuando lo necesites.
              </p>
            </div>
          </div>
        </div>

        {/* Soporte Técnico */}
        <div className="mt-12 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
          <div className="relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6 text-center">
            <p className="text-gray-300 font-medium mb-4">
              ¿Necesitas ayuda?
            </p>
            <a 
              href="/help" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         bg-gray-700/50 hover:bg-gray-700/70
                         text-gray-200 text-sm font-medium
                         border border-gray-600/30
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
    </div>
  );
};

export default CourseContent;