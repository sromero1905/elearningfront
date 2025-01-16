import React, { useState, useEffect } from 'react';
import { 
  Search, UserCircle, Video, WrenchIcon, CreditCard, Award, Mail, 
  ChevronDown, HelpCircle, X, MessageSquare, Clock, BookOpen, Activity,
  LayoutGrid, Sparkles, Globe, Shield
} from 'lucide-react';

interface AccordionItemProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  questionsCount: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  isOpen, onToggle, title, icon, children, questionsCount 
}) => {
  return (
    <div className={`
      border border-gray-700/50 rounded-xl mb-3 
      bg-gradient-to-b from-gray-800/90 to-gray-800/50 backdrop-blur-sm
      hover:from-gray-800 hover:to-gray-800/60 transition-all duration-300
      ${isOpen ? 'ring-1 ring-blue-500/20' : ''}
    `}>
      <button
        className="w-full p-6 flex items-center justify-between rounded-xl group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`
            text-blue-400 bg-blue-500/10 p-3 rounded-xl 
            group-hover:bg-blue-500/20 transition-colors duration-300
            ${isOpen ? 'bg-blue-500/20' : ''}
          `}>
            {icon}
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-100 text-lg block mb-1">{title}</span>
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {questionsCount} preguntas frecuentes
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`
            w-5 h-5 text-blue-400 transition-transform duration-500
            ${isOpen ? 'transform rotate-180' : ''}
          `}
        />
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-700/50 bg-gray-850/50">
          {children}
        </div>
      )}
    </div>
  );
};

interface ContentItem {
  question: string;
  answer: string;
  tags?: string[];
  updated?: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  content: ContentItem[];
  description: string;
  color: string;
}

const HelpCenter: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{category: string, items: ContentItem[]}[]>([]);
  const [showResults, setShowResults] = useState(false);

  const categories: Category[] = [
    {
      title: 'Gestión de Cuenta',
      icon: <UserCircle className="w-7 h-7" />,
      description: 'Seguridad y configuración de tu cuenta',
      color: 'blue',
      content: [
        {
          question: '¿Cómo activo la autenticación de dos factores?',
          answer: 'Accede a Configuración > Seguridad > Autenticación 2FA. Podrás elegir entre usar una aplicación de autenticación o recibir códigos por SMS. Recomendamos usar una app como Google Authenticator o Authy para mayor seguridad.',
          tags: ['seguridad', '2FA', 'autenticación'],
          updated: '2024-01-10'
        },
        {
          question: '¿Cómo cambio mi contraseña?',
          answer: 'Para cambiar tu contraseña, sigue estos pasos:\n1. Ve a Configuración de Cuenta\n2. Selecciona "Seguridad"\n3. Haz clic en "Cambiar Contraseña"\n4. Ingresa tu contraseña actual\n5. Crea una nueva contraseña segura\n6. Confirma la nueva contraseña',
          tags: ['seguridad', 'contraseña', 'acceso'],
          updated: '2024-01-12'
        },
        {
          question: '¿Cómo personalizo mis notificaciones?',
          answer: 'Personaliza tus notificaciones en Configuración > Notificaciones. Puedes elegir recibir alertas por email, push o SMS para diferentes eventos como nuevos cursos, actualizaciones o mensajes.',
          tags: ['notificaciones', 'preferencias'],
          updated: '2024-01-15'
        },
        {
          question: '¿Cómo vinculo mis redes sociales?',
          answer: 'En Configuración > Conexiones, puedes vincular tus cuentas de LinkedIn, GitHub y otras plataformas para compartir automáticamente tus logros y certificaciones.',
          tags: ['redes sociales', 'conexiones'],
          updated: '2024-01-14'
        }
      ]
    },
    {
      title: 'Cursos y Contenido',
      icon: <Video className="w-7 h-7" />,
      description: 'Todo sobre tus cursos y aprendizaje',
      color: 'purple',
      content: [
        {
          question: '¿Cómo funcionan los cursos en directo?',
          answer: 'Los cursos en directo son sesiones interactivas programadas. Recibirás un recordatorio 24h antes y podrás interactuar con el instructor y otros estudiantes en tiempo real.',
          tags: ['directo', 'clases', 'interactivo'],
          updated: '2024-01-12'
        },
        {
          question: '¿Puedo acceder al contenido sin conexión?',
          answer: 'Sí, puedes descargar lecciones para verlas sin conexión desde la app móvil. Busca el icono de descarga junto a cada lección. El contenido descargado estará disponible por 30 días.',
          tags: ['offline', 'móvil', 'descarga'],
          updated: '2024-01-15'
        },
        {
          question: '¿Cómo funcionan los grupos de estudio?',
          answer: 'Los grupos de estudio son espacios colaborativos donde puedes conectar con otros estudiantes. Puedes crear o unirte a grupos por tema, nivel o idioma.',
          tags: ['grupos', 'colaboración'],
          updated: '2024-01-16'
        }
      ]
    },
    {
      title: 'Soporte Técnico',
      icon: <WrenchIcon className="w-7 h-7" />,
      description: 'Ayuda con problemas técnicos',
      color: 'orange',
      content: [
        {
          question: '¿Qué navegadores son compatibles?',
          answer: 'Recomendamos usar las últimas versiones de:\n- Google Chrome\n- Mozilla Firefox\n- Microsoft Edge\n- Safari\nPara la mejor experiencia, mantén tu navegador actualizado.',
          tags: ['navegadores', 'compatibilidad'],
          updated: '2024-01-14'
        },
        {
          question: '¿Cómo mejoro la calidad del video?',
          answer: 'La calidad del video se ajusta automáticamente según tu conexión. Puedes ajustarla manualmente en el reproductor. Para mejor rendimiento, recomendamos una conexión de al menos 5 Mbps.',
          tags: ['video', 'calidad', 'streaming'],
          updated: '2024-01-15'
        }
      ]
    },
    {
      title: 'Certificaciones',
      icon: <Award className="w-7 h-7" />,
      description: 'Información sobre certificados',
      color: 'green',
      content: [
        {
          question: '¿Cómo verifico la autenticidad de un certificado?',
          answer: 'Cada certificado tiene un código QR y un ID único verificable en nuestra web. Los empleadores pueden verificar la autenticidad escaneando el código o ingresando el ID en nuestro portal.',
          tags: ['verificación', 'autenticidad'],
          updated: '2024-01-13'
        },
        {
          question: '¿Los certificados caducan?',
          answer: 'Los certificados no tienen fecha de caducidad, pero mostramos la fecha de emisión. Para algunas certificaciones profesionales, recomendamos actualizarlas cada 2-3 años.',
          tags: ['validez', 'actualización'],
          updated: '2024-01-14'
        }
      ]
    }
  ];

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = categories.map(category => ({
        category: category.title,
        items: category.content.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(result => result.items.length > 0);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleToggle = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute h-full w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-20 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />
      </div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-16 relative">
            

            {/* Title section */}
            <div className="text-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Centro de Ayuda
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  ¿Cómo podemos ayudarte hoy?
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000" />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-xl 
                         border border-gray-700/50 rounded-lg text-gray-100 
                         placeholder:text-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/30 transition-all duration-300"
                placeholder="Busca en nuestra base de conocimientos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-100">
                    Resultados de búsqueda
                    <span className="ml-2 text-sm text-gray-400">
                      ({searchResults.reduce((acc, cat) => acc + cat.items.length, 0)} resultados)
                    </span>
                  </h2>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-300 text-sm"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
                <div className="space-y-8">
                  {searchResults.map((result, idx) => (
                    <div key={idx}>
                      <h3 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {result.category}
                      </h3>
                      <div className="space-y-6">
                        {result.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="pl-4 border-l-2 border-blue-500/30">
                            <h4 className="font-medium text-gray-100 mb-2">{item.question}</h4>
                            <p className="text-gray-400 mb-3">{item.answer}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.tags?.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.updated && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Actualizado: {item.updated}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Access Grid */}
          {!showResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggle(idx)}
                  className="group p-6 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 
                           rounded-xl hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="text-blue-400 bg-blue-500/10 p-3 rounded-xl 
                                  group-hover:bg-blue-500/20 transition-all duration-300">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-100 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {category.content.length} artículos
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Accordion Section */}
          <div className="max-w-4xl mx-auto space-y-4">
            {categories.map((category, index) => (
              <AccordionItem
                key={index}
                isOpen={openSection === index}
                onToggle={() => handleToggle(index)}
                title={category.title}
                icon={category.icon}
                questionsCount={category.content.length}
              >
                <div className="space-y-8">
                  {category.content.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-700/50 pb-8 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-100 text-lg mb-4 flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-400" />
                        {item.question}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4">{item.answer}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {item.tags?.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.updated && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Actualizado: {item.updated}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl" />
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-6">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-100 mb-4">¿No encuentras lo que buscas?</h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Nuestro equipo de soporte está disponible de Lunes a Viernes de 9hs a 18hs para ayudarte con cualquier pregunta que tengas.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;