import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Star,
  Timer,
  MessageSquare,
  Heart
} from 'lucide-react';

// Interfaz para los datos del usuario
interface UserData {
  nombre?: string;
  apellido?: string;
  email?: string;
  // Otros campos que pueda tener el usuario
}

// Datos del Curso de Negociación
const courseData = {
  name: "Negociación Constructiva",
  instructor: "Dr. Carlos Mendoza",
  credentials: "PhD en Resolución de Conflictos - Harvard Business School",
  progress: 65,
  duration: "12 semanas",
  startDate: "15 Enero 2024",
  level: "Ejecutivo",
  certification: "Programa Avanzado en Negociación Empresarial",
  modulesCompleted: 4,
  totalModules: 8,
  nextSession: "Martes 23 Enero, 18:00 hrs",
  hoursCompleted: 24,
  totalHours: 48,
  rating: 4.9,
  participations: 28
};

// Datos estáticos del perfil que se completarán con los datos del usuario
const staticProfileData = {
  position: "Director Comercial",
  company: "Empresa Internacional S.A.",
  objetivos: [
    "Desarrollar estrategias de negociación avanzadas",
    "Mejorar habilidades de comunicación ejecutiva",
    "Implementar técnicas de resolución de conflictos"
  ],
  certificaciones: [
    {
      nombre: "Liderazgo Ejecutivo Avanzado",
      institucion: "Business Leadership Institute",
      fecha: "Diciembre 2023",
      credencialId: "LEA-2023-789",
      estado: "Completado"
    },
    {
      nombre: "Gestión de Equipos de Alto Rendimiento",
      institucion: "Executive Management School",
      fecha: "Octubre 2023",
      credencialId: "GEAR-2023-456",
      estado: "Completado"
    },
    {
      nombre: "Negociación Constructiva",
      institucion: "Programa Actual",
      fecha: "En Curso",
      progreso: "65%",
      estado: "En Progreso"
    }
  ],
  proximasActividades: [
    {
      titulo: "Sesión de Negociación Práctica",
      fecha: "23 Enero 2024",
      hora: "18:00 - 20:00",
      tipo: "Clase en Vivo"
    },
    {
      titulo: "Taller de Casos Prácticos",
      fecha: "25 Enero 2024",
      hora: "15:00 - 17:00",
      tipo: "Workshop"
    }
  ]
};

const CourseProfile: React.FC = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState<UserData>({});

  // Cargar datos del usuario al montar el componente
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
                  {courseData.name}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-100 font-medium">Instructor: {courseData.instructor}</p>
                  <p className="text-sm text-gray-400">{courseData.credentials}</p>
                </div>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-2xl">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duración</p>
                  <p className="text-gray-100">{courseData.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nivel</p>
                  <p className="text-gray-100">{courseData.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Timer className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Horas Completadas</p>
                  <p className="text-gray-100">{courseData.hoursCompleted} de {courseData.totalHours} hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Próxima Sesión</p>
                  <p className="text-gray-100">{courseData.nextSession}</p>
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
                <span className="text-2xl font-bold text-blue-400">{courseData.progress}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{width: `${courseData.progress}%`}}
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
                  {staticProfileData.objetivos.map((objetivo, index) => (
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
                  Próximas Actividades
                </h4>
                <div className="space-y-3">
                  {staticProfileData.proximasActividades.map((actividad, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-100">{actividad.titulo}</p>
                        <p className="text-xs text-gray-400">{actividad.fecha} • {actividad.hora}</p>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 mt-1">
                          {actividad.tipo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificaciones Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Mis Certificaciones</h2>
              <p className="text-gray-400">Seguimiento de tu desarrollo profesional</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticProfileData.certificaciones.map((cert, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-100 mb-1">{cert.nombre}</h3>
                    <p className="text-sm text-gray-400">{cert.institucion}</p>
                  </div>
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    cert.estado === "Completado" ? "bg-green-500/10" : "bg-blue-500/10"
                  }`}>
                    {cert.estado === "Completado" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{cert.fecha}</span>
                  {cert.credencialId && (
                    <span className="text-blue-400">ID: {cert.credencialId}</span>
                  )}
                  {cert.progreso && (
                    <span className="text-blue-400">{cert.progreso}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{courseData.hoursCompleted}h</span>
            </div>
            <p className="text-sm text-gray-400">Horas de Estudio</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{courseData.rating}/5</span>
            </div>
            <p className="text-sm text-gray-400">Calificación del Curso</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">{courseData.participations}</span>
            </div>
            <p className="text-sm text-gray-400">Participaciones</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Heart className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-100">95%</span>
            </div>
            <p className="text-sm text-gray-400">Satisfacción</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProfile;