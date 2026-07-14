// API Service Layer
// This service handles all API calls and can be easily switched between mock data and real backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Toggle between mock data and real API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Import mock data functions
import {
  loginUser as mockLoginUser,
  registerUser as mockRegisterUser,
  getClasses as mockGetClasses,
  getSessions as mockGetSessions,
  getAttendance as mockGetAttendance,
  addAttendance as mockAddAttendance,
  addSession as mockAddSession,
  addClass as mockAddClass,
  getActiveSessions as mockGetActiveSessions,
  updateUserProfile as mockUpdateUserProfile,
  getCourseSchedules as mockGetCourseSchedules,
  addCourseSchedule as mockAddCourseSchedule,
  updateCourseSchedule as mockUpdateCourseSchedule,
  deleteCourseSchedule as mockDeleteCourseSchedule
} from '../utils/mockData.js';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  if (USE_MOCK_DATA) {
    return mockApiCall(endpoint, options);
  }

  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Mock API call handler
async function mockApiCall(endpoint, options) {
  console.log('Mock API Call:', endpoint, options);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;
  
  switch (endpoint) {
    case '/auth/login':
      if (method === 'POST') {
        return mockLoginUser(body.email, body.password);
      }
      break;
      
    case '/auth/register':
      if (method === 'POST') {
        return mockRegisterUser(body);
      }
      break;
      
    case '/classes':
      if (method === 'GET') {
        return mockGetClasses();
      } else if (method === 'POST') {
        return mockAddClass(body);
      }
      break;
      
    case '/sessions':
      if (method === 'GET') {
        return mockGetSessions();
      } else if (method === 'POST') {
        return mockAddSession(body);
      }
      break;
      
    case '/attendance':
      if (method === 'GET') {
        return mockGetAttendance();
      } else if (method === 'POST') {
        return mockAddAttendance(body);
      }
      break;
      
    case '/sessions/active':
      if (method === 'GET') {
        return mockGetActiveSessions();
      }
      break;
      
    case '/user/profile':
      if (method === 'PUT') {
        const user = JSON.parse(localStorage.getItem('user'));
        return mockUpdateUserProfile(user.id, body);
      }
      break;
      
    case '/insights':
      if (method === 'GET') {
        // Mock AI insights with correct structure
        return [
          { 
            id: 1, 
            insight_type: 'improvement', 
            priority: 'medium',
            insight_text: 'Your attendance has improved by 5% this month. Keep up the good work!',
            created_at: new Date().toISOString()
          },
          { 
            id: 2, 
            insight_type: 'warning', 
            priority: 'high',
            insight_text: 'You have 3 late arrivals this month. Try to arrive 5 minutes early.',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          { 
            id: 3, 
            insight_type: 'info', 
            priority: 'low',
            insight_text: 'Your best performing class is CS101 with 95% attendance.',
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ];
      }
      break;
      
    case '/insights/generate':
      if (method === 'POST') {
        // Mock generate insights
        return { message: 'AI insights generated successfully' };
      }
      break;
      
    case '/schedules':
      if (method === 'GET') {
        return mockGetCourseSchedules();
      } else if (method === 'POST') {
        return mockAddCourseSchedule(body);
      }
      break;
      
    case '/schedules/:id':
      if (method === 'PUT') {
        const id = parseInt(endpoint.split('/').pop());
        return mockUpdateCourseSchedule(id, body);
      } else if (method === 'DELETE') {
        const id = parseInt(endpoint.split('/').pop());
        return mockDeleteCourseSchedule(id);
      }
      break;
      
    default:
      throw new Error(`Mock endpoint not found: ${endpoint}`);
  }
}

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Classes API
export const classesAPI = {
  getAll: () => apiCall('/classes'),
  
  create: (classData) => apiCall('/classes', {
    method: 'POST',
    body: JSON.stringify(classData)
  }),
  
  getById: (id) => apiCall(`/classes/${id}`),
  
  update: (id, classData) => apiCall(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(classData)
  }),
  
  delete: (id) => apiCall(`/classes/${id}`, {
    method: 'DELETE'
  })
};

// Sessions API
export const sessionsAPI = {
  getAll: () => apiCall('/sessions'),
  
  getActive: () => apiCall('/sessions/active'),
  
  create: (sessionData) => apiCall('/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData)
  }),
  
  getById: (id) => apiCall(`/sessions/${id}`),
  
  update: (id, sessionData) => apiCall(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sessionData)
  }),
  
  delete: (id) => apiCall(`/sessions/${id}`, {
    method: 'DELETE'
  })
};

// Attendance API
export const attendanceAPI = {
  getAll: () => apiCall('/attendance'),
  
  create: (attendanceData) => apiCall('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendanceData)
  }),
  
  getByStudent: (studentId) => apiCall(`/attendance/student/${studentId}`),
  
  getBySession: (sessionId) => apiCall(`/attendance/session/${sessionId}`),
  
  update: (id, attendanceData) => apiCall(`/attendance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attendanceData)
  }),
  
  delete: (id) => apiCall(`/attendance/${id}`, {
    method: 'DELETE'
  })
};

// User API
export const userAPI = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (profileData) => apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  
  changePassword: (passwordData) => apiCall('/user/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  })
};

// AI Insights API
export const insightsAPI = {
  getAll: () => apiCall('/insights'),
  
  generate: () => apiCall('/insights/generate', {
    method: 'POST'
  })
};

// Course Schedule API
export const scheduleAPI = {
  getAll: () => apiCall('/schedules'),
  
  create: (scheduleData) => apiCall('/schedules', {
    method: 'POST',
    body: JSON.stringify(scheduleData)
  }),
  
  getById: (id) => apiCall(`/schedules/${id}`),
  
  update: (id, scheduleData) => apiCall(`/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData)
  }),
  
  delete: (id) => apiCall(`/schedules/${id}`, {
    method: 'DELETE'
  })
};

// Export the API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USE_MOCK_DATA
};
