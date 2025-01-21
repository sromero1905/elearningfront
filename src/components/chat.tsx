import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Clock, 
  Send, 
  ChevronRight,
  Bot,
  AlertCircle,
  Loader,
  HeadphonesIcon
} from 'lucide-react';

interface Message {
  id: string;
  type: 'system' | 'user' | 'agent' | 'options';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
}

interface ChatOption {
  id: string;
  label: string;
  subOptions?: ChatOption[];
}

const initialTopics: ChatOption[] = [
  {
    id: 'technical',
    label: 'Problemas técnicos',
    subOptions: [
      { id: 'login', label: 'Problemas de inicio de sesión' },
      { id: 'video', label: 'Problemas con los videos' },
      { id: 'download', label: 'Problemas de descarga' },
      { id: 'other_tech', label: 'Otros problemas técnicos' }
    ]
  },
  {
    id: 'courses',
    label: 'Consultas sobre cursos',
    subOptions: [
      { id: 'content', label: 'Contenido del curso' },
      { id: 'certificate', label: 'Certificados' },
      { id: 'progress', label: 'Progreso del curso' },
      { id: 'other_course', label: 'Otras consultas' }
    ]
  },
  {
    id: 'billing',
    label: 'Facturación y pagos',
    subOptions: [
      { id: 'payment', label: 'Problemas con el pago' },
      { id: 'refund', label: 'Solicitud de reembolso' },
      { id: 'invoice', label: 'Facturas' },
      { id: 'other_billing', label: 'Otras consultas de facturación' }
    ]
  },
  {
    id: 'other',
    label: 'Otras consultas'
  }
];

const ChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showAgent, setShowAgent] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '👋 ¡Hola! ¿Sobre qué tema necesitas ayuda?',
      timestamp: new Date(),
      options: initialTopics
    }
  ]);

  const handleOptionSelect = (option: ChatOption) => {
    // Agregar la selección del usuario como mensaje
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: option.label,
      timestamp: new Date()
    }]);

    if (option.subOptions) {
      // Si hay sub-opciones, mostrarlas
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: '¿Podrías especificar más tu consulta?',
          timestamp: new Date(),
          options: option.subOptions
        }]);
      }, 500);
    } else {
      // Si no hay sub-opciones, ofrecer chat con asesor
      setSelectedTopic(option.id);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: 'Para ayudarte mejor con tu consulta, puedes:',
          timestamp: new Date(),
          options: [{
            id: 'agent',
            label: 'Hablar con un asesor'
          }]
        }]);
      }, 500);
    }
  };

  const handleAgentChat = () => {
    setShowAgent(true);
    setMessages(prev => [...prev, 
      {
        id: Date.now().toString(),
        type: 'system',
        content: 'Te conectaremos con un asesor disponible. Tiempo estimado de espera: 2-3 minutos.',
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);
    
    setMessage('');
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 rounded-full p-4
                   bg-gradient-to-r from-blue-600 to-blue-700
                   text-white shadow-lg transition-all duration-300
                   hover:shadow-blue-500/25 hover:scale-105
                   flex items-center gap-2 group
                   ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="text-sm font-medium pr-1">Chat de Soporte</span>
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Panel lateral */}
      <div className={`fixed inset-y-0 right-0 w-[400px] z-50
                      bg-gradient-to-b from-gray-900 to-gray-950
                      border-l border-gray-800/50 shadow-2xl
                      transition-transform duration-500 ease-in-out
                      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                {showAgent ? (
                  <HeadphonesIcon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Bot className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-100">
                  {showAgent ? 'Chat con Asesor' : 'Asistente Virtual'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-500 font-medium">En línea</span>
                  </div>
                  <span className="text-gray-500 text-xs">|</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>L-V, 9:00-18:00</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-300 transition-colors
                       bg-gray-800/50 p-2 rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 
                  ${msg.type === 'system' 
                    ? 'bg-gray-800/50 border border-gray-700/50 text-gray-300' 
                    : msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'}`}>
                  {msg.content}
                  {msg.options && (
                    <div className="mt-4 space-y-2">
                      {msg.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => option.id === 'agent' ? handleAgentChat() : handleOptionSelect(option)}
                          className="w-full p-2 text-sm text-left rounded-lg
                                   bg-gray-700/50 hover:bg-gray-700
                                   text-gray-200 transition-colors duration-200"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-400">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {showAgent && (
              <div className="flex items-center gap-2 text-sm text-gray-400 p-2 rounded-lg bg-gray-800/30">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Conectando con un asesor...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={showAgent ? "Escribe tu mensaje..." : "Selecciona una opción arriba..."}
                disabled={!showAgent}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12
                         text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/30 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit"
                disabled={!message.trim() || !showAgent}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                         text-blue-400 hover:text-blue-300 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3" />
              <span>
                {showAgent 
                  ? "Tiempo de respuesta estimado: 2-3 minutos" 
                  : "Selecciona el tema de tu consulta para continuar"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar en móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatPanel;