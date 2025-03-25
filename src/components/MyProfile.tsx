import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Clock,
  BookOpen,
  Target,
  Calendar,
  CheckCircle2,
  Video,
  Users,
  FileText,
  Building2,
  MessageSquare
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

interface Unidad {
  id: number;
  titulo: string;
  descripcion: string;
  duracion: string;
  fecha_clase?: string;
  date_raw?: string; // Añadido para manejar formatos de fecha
  link_zoom?: string;
  completada: boolean;
  completed?: boolean; // Añadido para compatibilidad con el backend
  materiales?: Material[];
}

interface Modulo {
  id: number;
  orden: number;
  titulo: string;
  descripcion: string;
  unidades: Unidad[];
  lessons?: Unidad[]; // Añadido para compatibilidad con respuesta del backend
  progress: number;
  completed: boolean;
}

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  activo: boolean;
  duracion_total?: string;
  Tutor?: string;
  ProfesionTutor?: string;
  modulos: Modulo[];
}

// Objetivos estáticos del programa
const objetivosPrograma = [
  "Desarrollar estrategias de negociación avanzadas",
  "Mejorar habilidades de comunicación ejecutiva",
  "Implementar técnicas de resolución de conflictos"
];

const API_URL = process.env.BACK_URL || 'http://localhost:1337';

// Configuración de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token JWT del localStorage
const getToken = () => {
  return localStorage.getItem('userToken');
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

const CourseProfile: React.FC = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState<UserData>({});
  
  // Estado para el curso y sus datos
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados calculados
  const [proximasClases, setProximasClases] = useState<Unidad[]>([]);
  const [totales, setTotales] = useState({
    clasesCompletadas: 0,
    clasesTotal: 0,
    duracionTotal: "0h",
    usuariosCreados: 0
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    // Cargar datos del usuario
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

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los cursos disponibles
        const cursosResponse = await api.get('/cursos?populate=*');
        const cursosData = cursosResponse.data.data || cursosResponse.data || [];
        
        // Si no hay cursos, mostrar error
        if (!cursosData.length) {
          setError('No hay cursos disponibles.');
          setLoading(false);
          return;
        }
        
        // Tomar el primer curso de la lista
        const cursoData = cursosData[0];
        const cursoId = cursoData.id;
        
        // Obtener los módulos de este curso
        const modulosResponse = await api.get(`/modulos/curso/${cursoId}`);
        const modulosData = modulosResponse.data;
        
        // Obtener detalles de cada módulo con sus unidades
        const modulosCompletos = await Promise.all(
          modulosData.map(async (modulo: any) => {
            const moduloDetalladoResponse = await api.get(`/modulos/${modulo.id}`);
            return moduloDetalladoResponse.data;
          })
        );
        
        // Armar el objeto curso completo
        const cursoCompleto: Curso = {
          id: cursoData.id,
          titulo: cursoData.attributes?.titulo || cursoData.titulo || "Curso sin título",
          descripcion: cursoData.attributes?.descripcion || cursoData.descripcion || "",
          activo: cursoData.attributes?.activo || cursoData.activo || true,
          Tutor: cursoData.attributes?.Tutor || cursoData.Tutor || "Dr. Carlos Mendoza",
          ProfesionTutor: cursoData.attributes?.ProfesionTutor || cursoData.ProfesionTutor || "PhD en Resolución de Conflictos - Harvard Business School",
          duracion_total: cursoData.attributes?.duracion_total || cursoData.duracion_total || "0h",
          modulos: modulosCompletos
        };
        
        setCurso(cursoCompleto);
        
        // Calcular estadísticas y fechas
        calcularEstadisticas(cursoCompleto);
        
        // Obtener usuarios creados (esto puede requerir un endpoint adicional)
        try {
          const usuariosResponse = await api.get('/user-elearnings');
          const usuariosData = usuariosResponse.data.data || usuariosResponse.data;
          setTotales(prev => ({...prev, usuariosCreados: usuariosData.length || 35}));
        } catch (err) {
          console.log('No se pudo obtener el número de usuarios:', err);
          // En caso de error, usar un valor predeterminado
          setTotales(prev => ({...prev, usuariosCreados: 35}));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del curso:', err);
        setError('No se pudo cargar la información del curso. Intente de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, []);
  
  // Función para calcular estadísticas y próximas clases
  const calcularEstadisticas = (curso: Curso) => {
    let clasesCompletadas = 0;
    let clasesTotal = 0;
    let duracionMinutos = 0;
    const todasLasClases: Unidad[] = [];
    
    // Recopilar datos de todas las unidades
    curso.modulos.forEach(modulo => {
      // Usar unidades o lessons, dependiendo de lo que esté disponible
      const unidadesArr = modulo.lessons || modulo.unidades || [];
      
      unidadesArr.forEach((unidad: Unidad) => {
        clasesTotal++;
        todasLasClases.push(unidad);
        
        if (unidad.completed || unidad.completada) {
          clasesCompletadas++;
        }
        
        // Sumar la duración (convertir a minutos)
        const duracionStr = unidad.duracion || "1h";
        const horasMatch = duracionStr.match(/(\d+)h/);
        const minutosMatch = duracionStr.match(/(\d+)min/);
        
        const horas = horasMatch ? parseInt(horasMatch[1]) : 0;
        const minutos = minutosMatch ? parseInt(minutosMatch[1]) : 0;
        
        duracionMinutos += (horas * 60) + minutos;
      });
    });
    
    // Convertir minutos a formato legible
    const horas = Math.floor(duracionMinutos / 60);
    const minutosRestantes = duracionMinutos % 60;
    const duracionTotal = minutosRestantes > 0 
      ? `${horas}h ${minutosRestantes}min` 
      : `${horas}h`;
    
    // Actualizar totales
    setTotales({
      clasesCompletadas,
      clasesTotal,
      duracionTotal,
      usuariosCreados: 0 // Se actualizará desde la API
    });
    
    // Encontrar próximas clases (no completadas, ordenadas por fecha)
    const hoy = new Date();
    const clasesNoCompletadas = todasLasClases
      .filter(unidad => !(unidad.completed || unidad.completada))
      .sort((a, b) => {
        // Usar fecha_clase si date_raw no está disponible
        const fechaA = a.date_raw ? a.date_raw : a.fecha_clase;
        const fechaB = b.date_raw ? b.date_raw : b.fecha_clase;
        
        if (!fechaA || !fechaB) return 0;
        return new Date(fechaA).getTime() - new Date(fechaB).getTime();
      });
    
    // Tomar las próximas 4 clases
    setProximasClases(clasesNoCompletadas.slice(0, 4));
  };

  // Función para obtener el nombre completo del usuario
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

  // Función para obtener el email del usuario
  const getUserEmail = () => {
    return userData.email || "";
  };

  // Función para obtener la primera letra del nombre para el avatar
  const getUserInitial = () => {
    if (userData.nombre) {
      return userData.nombre.charAt(0).toUpperCase();
    } else if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    } else {
      return "U";
    }
  };

  // Calcular el progreso total
  const calcularProgresoTotal = () => {
    if (!curso || !curso.modulos) return 0;
    const totalClases = totales.clasesTotal;
    if (totalClases === 0) return 0;
    return Math.round((totales.clasesCompletadas / totalClases) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Cargando información del curso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-900/30 p-6 rounded-xl border border-red-700/50 text-white">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute h-full w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course Header */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-8 mb-12">
          {/* Course Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {curso?.titulo || "Curso de Negociación"}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-100 font-medium">Instructor: {curso?.Tutor || "Dr. Carlos Mendoza"}</p>
                  <p className="text-sm text-gray-400">{curso?.ProfesionTutor || "PhD en Resolución de Conflictos - Harvard Business School"}</p>
                </div>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-2xl">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duración</p>
                  <p className="text-gray-100">{totales.duracionTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Clases Completadas</p>
                  <p className="text-gray-100">{totales.clasesCompletadas} de {totales.clasesTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Participantes</p>
                  <p className="text-gray-100">{totales.usuariosCreados}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Material Disponible</p>
                  <p className="text-gray-100">Documentos y recursos</p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-gray-100 font-medium mb-1">Progreso del Programa</h3>
                  <p className="text-sm text-gray-400">Continúa tu camino hacia la excelencia en negociación</p>
                </div>
                <span className="text-2xl font-bold text-blue-400">{calcularProgresoTotal()}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{width: `${calcularProgresoTotal()}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* User Profile - Con datos dinámicos */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto ring-4 ring-blue-500/20">
                  <span className="text-3xl font-bold text-white">
                    {getUserInitial()}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-100 mb-1">{getUserFullName()}</h2>
              <p className="text-gray-400 text-sm mb-1">{getUserEmail()}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <h4 className="font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Objetivos del Programa
                </h4>
                <ul className="space-y-2">
                  {objetivosPrograma.map((objetivo, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      {objetivo}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <h4 className="font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Próximas Clases
                </h4>
                <div className="space-y-3">
                  {proximasClases.length > 0 ? (
                    proximasClases.map((clase, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-100">{clase.titulo}</p>
                          <p className="text-xs text-gray-400">
                            {clase.fecha_clase ? new Date(clase.fecha_clase).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long'
                            }) : 'Fecha por confirmar'}
                          </p>
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 mt-1">
                            Clase en vivo
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No hay clases programadas próximamente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{totales.duracionTotal.split(' ')[0]}</span>
            </div>
            <p className="text-sm text-gray-400">Horas de Estudio</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{totales.clasesCompletadas}/{totales.clasesTotal}</span>
            </div>
            <p className="text-sm text-gray-400">Clases Completadas</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{totales.usuariosCreados}</span>
            </div>
            <p className="text-sm text-gray-400">Participantes</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{curso?.modulos?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-400">Módulos Disponibles</p>
          </div>
        </div>
        
        {/* Soporte Técnico - Versión más compacta */}
        <div className="flex justify-center mt-10">
          <div className="relative max-w-sm mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-lg opacity-70" />
            <div className="relative bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-xl py-4 px-6 flex items-center justify-between shadow-lg">
              <p className="text-gray-200 font-medium mr-4">
                ¿Necesitas ayuda?
              </p>
              <a 
                href="/help" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg
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
      </div>
    </div>
  );
};

export default CourseProfile;