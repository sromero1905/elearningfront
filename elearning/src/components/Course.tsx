import React from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  FileText,
  Video,
  Clock,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  Download,
  MessagesSquare
} from 'lucide-react';

interface Lesson {
  title: string;
  duration: string;
  type: 'video';
  hasResources: boolean;
  completed?: boolean;
  locked?: boolean;
  date?: string;
  description?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  locked?: boolean;
  progress: number;
  lessons: Lesson[];
}

const CourseContent: React.FC = () => {
  const modules: Module[] = [
    {
      id: 1,
      title: "Fundamentos de la Negociación Constructiva",
      description: "Bases teóricas y prácticas para una negociación efectiva",
      duration: "12h",
      completed: true,
      progress: 100,
      lessons: [
        {
          title: "Bienvenida e Introducción al Curso",
          description: "Presentación del programa y metodología de trabajo",
          duration: "45min",
          type: "video",
          completed: true,
          hasResources: true,
          date: "15 de Enero"
        },
        {
          title: "¿Qué es la Negociación Constructiva?",
          description: "Conceptos fundamentales y diferencias con otros enfoques",
          duration: "1h 30min",
          type: "video",
          completed: true,
          hasResources: true,
          date: "15 de Enero"
        },
        {
          title: "Elementos Clave de la Negociación",
          description: "Identificación de intereses, posiciones y criterios objetivos",
          duration: "2h",
          type: "video",
          completed: true,
          hasResources: true,
          date: "17 de Enero"
        },
        {
          title: "Preparación Estratégica",
          description: "Metodología para preparar negociaciones efectivas",
          duration: "2h",
          type: "video",
          completed: true,
          hasResources: true,
          date: "19 de Enero"
        },
        {
          title: "Taller Práctico: Casos de Estudio",
          description: "Análisis y resolución de casos reales",
          duration: "2h 30min",
          type: "video",
          completed: true,
          hasResources: true,
          date: "22 de Enero"
        },
        {
          title: "Evaluación del Módulo 1",
          description: "Revisión de conceptos y retroalimentación grupal",
          duration: "1h 15min",
          type: "video",
          completed: true,
          hasResources: true,
          date: "24 de Enero"
        }
      ]
    },
    {
      id: 2,
      title: "Estrategias y Habilidades Avanzadas",
      description: "Técnicas y herramientas para el manejo de negociaciones complejas",
      duration: "15h",
      progress: 40,
      lessons: [
        {
          title: "Comunicación Efectiva en la Negociación",
          description: "Técnicas de comunicación verbal y no verbal",
          duration: "2h",
          type: "video",
          completed: true,
          hasResources: true,
          date: "29 de Enero"
        },
        {
          title: "Manejo de Emociones y Conflictos",
          description: "Estrategias para situaciones de alta tensión",
          duration: "2h 30min",
          type: "video",
          completed: true,
          hasResources: true,
          date: "31 de Enero"
        },
        {
          title: "Tácticas de Influencia y Persuasión",
          description: "Herramientas para una persuasión ética y efectiva",
          duration: "2h",
          type: "video",
          completed: true,
          hasResources: true,
          date: "5 de Febrero"
        },
        {
          title: "Negociaciones Multiculturales",
          description: "Consideraciones y estrategias para contextos internacionales",
          duration: "2h",
          type: "video",
          completed: false,
          hasResources: true,
          date: "7 de Febrero"
        },
        {
          title: "Taller: Simulaciones Avanzadas",
          description: "Práctica con escenarios complejos",
          duration: "3h",
          type: "video",
          completed: false,
          hasResources: true,
          date: "12 de Febrero"
        },
        {
          title: "Evaluación y Feedback - Módulo 2",
          description: "Análisis de casos y retroalimentación personalizada",
          duration: "1h 30min",
          type: "video",
          completed: false,
          hasResources: true,
          date: "14 de Febrero"
        }
      ]
    },
    {
      id: 3,
      title: "Negociación en la Práctica Profesional",
      description: "Aplicación práctica y casos de estudio avanzados",
      duration: "13h",
      locked: true,
      progress: 0,
      lessons: [
        {
          title: "Negociaciones Comerciales Complejas",
          description: "Estrategias para acuerdos comerciales de alto nivel",
          duration: "2h 30min",
          type: "video",
          locked: true,
          hasResources: true,
          date: "19 de Febrero"
        },
        {
          title: "Negociación en Equipos",
          description: "Dinámicas y roles en negociaciones grupales",
          duration: "2h",
          type: "video",
          locked: true,
          hasResources: true,
          date: "21 de Febrero"
        },
        {
          title: "Mediación y Facilitación",
          description: "Rol del negociador como mediador",
          duration: "2h",
          type: "video",
          locked: true,
          hasResources: true,
          date: "26 de Febrero"
        },
        {
          title: "Casos de Éxito y Lecciones Aprendidas",
          description: "Análisis de negociaciones reales exitosas",
          duration: "2h",
          type: "video",
          locked: true,
          hasResources: true,
          date: "28 de Febrero"
        },
        {
          title: "Proyecto Final Integrador",
          description: "Desarrollo y presentación de caso práctico",
          duration: "3h",
          type: "video",
          locked: true,
          hasResources: true,
          date: "4 de Marzo"
        },
        {
          title: "Cierre y Evaluación Final",
          description: "Conclusiones y certificación",
          duration: "1h 30min",
          type: "video",
          locked: true,
          hasResources: true,
          date: "6 de Marzo"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0D1729] to-[#0F1C33]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Principal */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Programa de Negociación Constructiva
          </h1>
          <p className="text-lg text-blue-300/80 max-w-3xl mx-auto">
            Desarrolla habilidades avanzadas de negociación a través de un programa práctico y comprehensivo
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <BookOpen className="h-6 w-6" />,
              label: "Progreso Total",
              value: "40%",
              color: "text-blue-400"
            },
            {
              icon: <Clock className="h-6 w-6" />,
              label: "Duración Total",
              value: "40 horas",
              color: "text-indigo-400"
            },
            {
              icon: <MessagesSquare className="h-6 w-6" />,
              label: "Próxima Clase",
              value: "7 Feb, 10:00",
              color: "text-purple-400"
            },
            {
              icon: <BarChart3 className="h-6 w-6" />,
              label: "Certificación",
              value: "En progreso",
              color: "text-emerald-400"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-[#111827]/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <div className={`${stat.color} mb-4 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Módulos */}
        <div className="space-y-8">
          {modules.map((module) => (
            <div key={module.id} className="bg-[#111827]/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
              {/* Cabecera del Módulo */}
              <div className="p-6 border-b border-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
                        Módulo {module.id}
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
                    <h2 className="text-xl font-semibold text-white mt-3">
                      {module.title}
                    </h2>
                    <p className="text-gray-400 mt-2">{module.description}</p>
                    
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

              {/* Lista de Lecciones */}
              <div className="divide-y divide-gray-800/50">
                {module.lessons.map((lesson, index) => (
                  <div 
                    key={index}
                    className="p-6 hover:bg-gray-800/20 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
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
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.duration}
                          </span>
                          {lesson.date && (
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {lesson.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones de la lección */}
                    <div className="flex items-center space-x-3">
                      {lesson.hasResources && !lesson.locked && (
                        <button 
                          className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-800/30 rounded-lg"
                          title="Materiales de la clase"
                        >
                         <FileText className="h-5 w-5" />
                        </button>
                      )}
                      {!lesson.locked && !lesson.completed && (
                        <button className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center space-x-2">
                          <PlayCircle className="h-5 w-5" />
                          <span>Ver clase</span>
                        </button>
                      )}
                      {!lesson.locked && lesson.completed && (
                        <button className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center space-x-2">
                          <PlayCircle className="h-5 w-5" />
                          <span>Repasar</span>
                        </button>
                      )}
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
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:soporte@negociacionconstructiva.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              soporte@negociacionconstructiva.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;