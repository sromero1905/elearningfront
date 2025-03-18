import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Determinar la URL base según el entorno
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://tu-api-produccion.com' // Reemplazar con tu URL de producción
  : 'http://localhost:1337';

// Interfaz para las respuestas de login
interface LoginResponse {
  user: any;
  token: string;
}

// Interfaz para el usuario con cursos
interface UserWithCourses {
  id: number;
  nombre?: string;
  apellido?: string;
  email: string;
  cursos: Course[];
}

// Interfaz para curso
interface Course {
  id: number;
  Titulo?: string;
  titulo?: string;
  descripcion?: string;
}

class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    // Crear instancia de axios con la URL base
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Interceptor para añadir token de autenticación a todas las peticiones
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
  
  /**
   * Iniciar sesión
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/api/user-elearnings/login', {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
  
  /**
   * Cerrar sesión (eliminar datos de localStorage)
   */
  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }
  
  /**
   * Comprobar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }
  
  /**
   * Obtener el usuario actual desde localStorage
   */
  getCurrentUser(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  
  /**
   * Obtener usuario con sus cursos desde la API
   * @param userId - ID del usuario
   */
  async getUserWithCourses(userId: number): Promise<UserWithCourses> {
    try {
      const response = await this.api.get(`/api/user-elearnings/${userId}?populate=cursos`);
      
      // En Strapi v4 la respuesta podría tener una estructura diferente
      // Debemos verificar si la respuesta tiene el formato v3 o v4
      
      // Si es formato v3 (respuesta directa con cursos)
      if (response.data && response.data.cursos) {
        return response.data;
      }
      
      // Si es formato v4 (respuesta con data.attributes)
      if (response.data && response.data.data && response.data.data.attributes) {
        const userData = response.data.data;
        const userAttributes = userData.attributes;
        
        // Formatear datos del usuario
        const formattedUser: UserWithCourses = {
          id: userData.id,
          ...userAttributes,
          cursos: []
        };
        
        // Formatear cursos si existen
        if (userAttributes.cursos && userAttributes.cursos.data) {
          formattedUser.cursos = userAttributes.cursos.data.map((course: any) => ({
            id: course.id,
            ...course.attributes
          }));
        }
        
        return formattedUser;
      }
      
      // Si la estructura no coincide con ninguna de las esperadas
      throw new Error('Formato de respuesta no reconocido');
    } catch (error) {
      console.error('Error al obtener usuario con cursos:', error);
      throw error;
    }
  }
  
  /**
   * Solicitar recuperación de contraseña
   * @param email - Email del usuario
   */
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await this.api.post('/api/user-elearnings/forgot-password', {
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error en solicitud de recuperación de contraseña:', error);
      throw error;
    }
  }
  
  /**
   * Restablecer contraseña
   * @param email - Email del usuario
   * @param resetToken - Token de restablecimiento
   * @param newPassword - Nueva contraseña
   */
  async resetPassword(email: string, resetToken: string, newPassword: string): Promise<any> {
    try {
      const response = await this.api.post('/api/user-elearnings/reset-password', {
        email,
        resetToken,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  }
  
  /**
   * Obtener módulos y lecciones de un curso
   * @param courseId - ID del curso
   */
  async getCourseContent(courseId: number): Promise<any> {
    try {
      const response = await this.api.get(`/api/cursos/${courseId}?populate=modulos.lecciones`);
      
      // Procesar respuesta según formato (v3 o v4)
      if (response.data && response.data.data && response.data.data.attributes) {
        // Formato v4
        const courseData = response.data.data;
        const courseAttrs = courseData.attributes;
        
        return {
          id: courseData.id,
          ...courseAttrs,
          modulos: courseAttrs.modulos?.data?.map((modulo: any) => ({
            id: modulo.id,
            ...modulo.attributes,
            lecciones: modulo.attributes.lecciones?.data?.map((leccion: any) => ({
              id: leccion.id,
              ...leccion.attributes
            })) || []
          })) || []
        };
      }
      
      // Formato v3 o formato directo
      return response.data;
    } catch (error) {
      console.error('Error al obtener contenido del curso:', error);
      throw error;
    }
  }
}

// Crear una instancia para exportar (singleton)
export const apiService = new ApiService();