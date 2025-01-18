import React, { useState } from 'react';
import {
  Book,
  Clock,
  TrendingUp,
  Award,
  Info,
  Video,
  Calendar,
  Target
} from 'lucide-react';

// Course and User Profile Data
const courseData = {
  name: "Desarrollo Web Avanzado",
  instructor: "Carlos Mendoza",
  progress: 65,
  duration: "8 semanas",
  startDate: "15 Enero 2024",
  level: "Intermedio",
  certification: "Desarrollo Frontend Profesional"
};

const userProfileData = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
  avatar: "/api/placeholder/120/120",
  bio: "Desarrollador web apasionado con experiencia en React y diseño de interfaces modernas.",
  skills: ["React", "TypeScript", "Tailwind CSS", "UX Design"],
  goals: ["Dominar desarrollo frontend", "Crear aplicaciones web escalables"]
};

const CourseProfile: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const ZoomTip = ({ 
    icon: Icon, 
    title, 
    description, 
    id 
  }: { 
    icon: React.ElementType, 
    title: string, 
    description: string, 
    id: string 
  }) => (
    <div 
      className="relative group"
      onMouseEnter={() => setActiveTooltip(id)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 hover:bg-slate-750 transition-colors">
        <div className="bg-indigo-500/20 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          {activeTooltip === id && (
            <div className="absolute z-10 left-full ml-4 top-1/2 -translate-y-1/2">
              <div className="bg-slate-700 text-white text-sm px-4 py-2 rounded-lg shadow-xl">
                {description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Course and User Header */}
        <div className="grid md:grid-cols-[1fr,300px] gap-6 mb-8">
          {/* Course Information */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-indigo-400">
              {courseData.name}
            </h1>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Book className="w-5 h-5 text-indigo-400" />
                <span>Instructor: {courseData.instructor}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Inicio: {courseData.startDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Duración: {courseData.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Nivel: {courseData.level}</span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Progreso del Curso</span>
                <span className="font-bold text-indigo-400">{courseData.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full" 
                  style={{width: `${courseData.progress}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
                <span className="text-4xl font-bold text-white">
                  {userProfileData.name.charAt(0)}
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">{userProfileData.name}</h2>
            <p className="text-slate-400 text-sm mb-4">{userProfileData.email}</p>
            <p className="text-slate-300 mb-4">{userProfileData.bio}</p>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-indigo-400">Mis Habilidades</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {userProfileData.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-slate-600 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Zoom-Style Tips Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <ZoomTip 
            id="course-objectives"
            icon={Target}
            title="Objetivos del Curso"
            description="Desarrollar habilidades avanzadas en desarrollo web frontend, dominando tecnologías modernas y mejores prácticas de diseño."
          />
          <ZoomTip 
            id="certification"
            icon={Award}
            title="Certificación"
            description={`Obtén tu certificado de ${courseData.certification} al completar satisfactoriamente el curso.`}
          />
          <ZoomTip 
            id="resources"
            icon={Video}
            title="Recursos del Curso"
            description="Accede a videos exclusivos, materiales de estudio y proyectos prácticos para potenciar tu aprendizaje."
          />
        </div>
      </div>
    </div>
  );
};

export default CourseProfile;