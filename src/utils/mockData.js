// Mock data service for frontend-only application
// Uses localStorage to persist data

const STORAGE_KEYS = {
  USERS: 'attendance_users',
  CLASSES: 'attendance_classes',
  SESSIONS: 'attendance_sessions',
  ATTENDANCE: 'attendance_records',
  ACTIVE_SESSIONS: 'active_sessions',
  QR_CODES: 'qr_codes',
  AUDIT_LOGS: 'audit_logs',
  ROLES: 'roles',
  COURSE_SCHEDULES: 'course_schedules'
};

// Default mock data
const DEFAULT_USERS = [
  { id: 1, email: 'student@university.edu', password: 'password', full_name: 'Test Student', student_id: 'STU001', department: 'Computer Science', role: 'student' }
];

const DEFAULT_CLASSES = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101', schedule: 'Mon, Wed 9:00 AM', instructor: 'Dr. Smith' },
  { id: 2, name: 'Data Structures', code: 'CS201', schedule: 'Tue, Thu 11:00 AM', instructor: 'Dr. Johnson' },
  { id: 3, name: 'Web Development', code: 'CS301', schedule: 'Wed, Fri 2:00 PM', instructor: 'Prof. Williams' }
];

const DEFAULT_SESSIONS = [
  { id: 1, class_id: 1, class_name: 'Introduction to Computer Science', session_name: 'Lecture 1', date: '2024-01-15', status: 'present', check_in_time: '2024-01-15T09:05:00' },
  { id: 2, class_id: 1, class_name: 'Introduction to Computer Science', session_name: 'Lecture 2', date: '2024-01-17', status: 'present', check_in_time: '2024-01-17T09:03:00' },
  { id: 3, class_id: 1, class_name: 'Introduction to Computer Science', session_name: 'Lecture 3', date: '2024-01-22', status: 'late', check_in_time: '2024-01-22T09:18:00' },
  { id: 4, class_id: 2, class_name: 'Data Structures', session_name: 'Lecture 1', date: '2024-01-16', status: 'present', check_in_time: '2024-01-16T11:02:00' },
  { id: 5, class_id: 2, class_name: 'Data Structures', session_name: 'Lecture 2', date: '2024-01-18', status: 'absent', check_in_time: null }
];

const DEFAULT_ACTIVE_SESSIONS = [
  { 
    id: 1, 
    class_id: 1, 
    class_name: 'Introduction to Computer Science', 
    session_name: 'Lecture 4', 
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    location: { lat: 40.7128, lng: -74.0060, name: 'Lecture Hall A' },
    qr_code_id: 'qr_001'
  }
];

const DEFAULT_COURSE_SCHEDULES = [
  { 
    id: 1, 
    course_name: 'Introduction to Computer Science', 
    course_code: 'CS101',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:30',
    venue: 'Lecture Hall A',
    reminder_note: 'Bring laptop for lab session'
  },
  { 
    id: 2, 
    course_name: 'Data Structures', 
    course_code: 'CS201',
    day_of_week: 'Monday',
    start_time: '11:00',
    end_time: '12:30',
    venue: 'Room 302',
    reminder_note: 'Chapter 5 quiz'
  },
  { 
    id: 3, 
    course_name: 'Web Development', 
    course_code: 'CS301',
    day_of_week: 'Monday',
    start_time: '14:00',
    end_time: '15:30',
    venue: 'Lab 101',
    reminder_note: 'Project presentation'
  },
  { 
    id: 4, 
    course_name: 'Database Systems', 
    course_code: 'CS202',
    day_of_week: 'Tuesday',
    start_time: '09:00',
    end_time: '10:30',
    venue: 'Room 205',
    reminder_note: ''
  },
  { 
    id: 5, 
    course_name: 'Introduction to Computer Science', 
    course_code: 'CS101',
    day_of_week: 'Wednesday',
    start_time: '09:00',
    end_time: '10:30',
    venue: 'Lecture Hall A',
    reminder_note: ''
  },
  { 
    id: 6, 
    course_name: 'Data Structures', 
    course_code: 'CS201',
    day_of_week: 'Wednesday',
    start_time: '11:00',
    end_time: '12:30',
    venue: 'Room 302',
    reminder_note: ''
  },
  { 
    id: 7, 
    course_name: 'Algorithms', 
    course_code: 'CS303',
    day_of_week: 'Thursday',
    start_time: '09:00',
    end_time: '10:30',
    venue: 'Lecture Hall B',
    reminder_note: 'Midterm review'
  },
  { 
    id: 8, 
    course_name: 'Database Systems', 
    course_code: 'CS202',
    day_of_week: 'Thursday',
    start_time: '14:00',
    end_time: '15:30',
    venue: 'Room 205',
    reminder_note: ''
  },
  { 
    id: 9, 
    course_name: 'Web Development', 
    course_code: 'CS301',
    day_of_week: 'Friday',
    start_time: '09:00',
    end_time: '10:30',
    venue: 'Lab 101',
    reminder_note: 'Final project due'
  }
];

const DEFAULT_QR_CODES = [
  {
    id: 'qr_001',
    session_id: 1,
    data: JSON.stringify({
      sessionId: 1,
      timestamp: new Date().toISOString(),
      classId: 1,
      nonce: Math.random().toString(36).substring(7)
    }),
    created_at: new Date().toISOString()
  }
];

const DEFAULT_AUDIT_LOGS = [
  {
    id: 1,
    action: 'LOGIN',
    user_id: 1,
    user_email: 'student@university.edu',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    device_id: 'device-001',
    location: { lat: 40.7128, lng: -74.0060 },
    ip_address: '192.168.1.1',
    details: 'Student logged in successfully'
  },
  {
    id: 2,
    action: 'ATTENDANCE_MARKED',
    user_id: 1,
    user_email: 'student@university.edu',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    device_id: 'device-001',
    location: { lat: 40.7128, lng: -74.0060 },
    ip_address: '192.168.1.1',
    details: 'Attendance marked for session 1'
  }
];

const DEFAULT_ROLES = [
  {
    id: 'student',
    name: 'Student',
    permissions: ['mark_own_attendance', 'view_own_attendance', 'view_own_classes']
  }
];

// Initialize mock data if not exists
const initializeData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEFAULT_SESSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(DEFAULT_ACTIVE_SESSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QR_CODES)) {
      localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(DEFAULT_QR_CODES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROLES)) {
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

// Helper to safely get data from localStorage
const safeGetItem = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Helper to safely set data to localStorage
const safeSetItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Auth functions
export const registerUser = (userData) => {
  initializeData();
  const users = safeGetItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
  const existingUser = users.find(u => u.email === userData.email);
  
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: Date.now(),
    ...userData,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  safeSetItem(STORAGE_KEYS.USERS, users);
  
  return { token: 'mock-token-' + Date.now(), user: newUser };
};

export const loginUser = (email, password) => {
  // Direct check against default users for demo purposes
  const user = DEFAULT_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  return { token: 'mock-token-' + Date.now(), user };
};

export const getUsers = () => {
  return DEFAULT_USERS;
};

// Data functions
export const getClasses = () => {
  initializeData();
  return safeGetItem(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
};

export const getSessions = () => {
  initializeData();
  return safeGetItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
};

export const getAttendance = () => {
  initializeData();
  return safeGetItem(STORAGE_KEYS.ATTENDANCE, []);
};

export const addAttendance = (record) => {
  initializeData();
  const attendance = safeGetItem(STORAGE_KEYS.ATTENDANCE, []);
  const newRecord = { id: Date.now(), ...record, created_at: new Date().toISOString() };
  attendance.push(newRecord);
  safeSetItem(STORAGE_KEYS.ATTENDANCE, attendance);
  return newRecord;
};

export const addSession = (session) => {
  initializeData();
  const sessions = safeGetItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
  const newSession = { id: Date.now(), ...session };
  sessions.push(newSession);
  safeSetItem(STORAGE_KEYS.SESSIONS, sessions);
  return newSession;
};

export const addClass = (classData) => {
  initializeData();
  const classes = safeGetItem(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
  const newClass = { id: Date.now(), ...classData };
  classes.push(newClass);
  safeSetItem(STORAGE_KEYS.CLASSES, classes);
  return newClass;
};

export const updateUserProfile = (userId, profileData) => {
  initializeData();
  const users = safeGetItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...profileData };
    safeSetItem(STORAGE_KEYS.USERS, users);
    return users[userIndex];
  }
  
  throw new Error('User not found');
};

export const getCourseSchedules = () => {
  initializeData();
  return safeGetItem(STORAGE_KEYS.COURSE_SCHEDULES, DEFAULT_COURSE_SCHEDULES);
};

export const addCourseSchedule = (scheduleData) => {
  initializeData();
  const schedules = safeGetItem(STORAGE_KEYS.COURSE_SCHEDULES, DEFAULT_COURSE_SCHEDULES);
  const newSchedule = { id: Date.now(), ...scheduleData };
  schedules.push(newSchedule);
  safeSetItem(STORAGE_KEYS.COURSE_SCHEDULES, schedules);
  return newSchedule;
};

export const updateCourseSchedule = (scheduleId, scheduleData) => {
  initializeData();
  const schedules = safeGetItem(STORAGE_KEYS.COURSE_SCHEDULES, DEFAULT_COURSE_SCHEDULES);
  const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
  
  if (scheduleIndex !== -1) {
    schedules[scheduleIndex] = { ...schedules[scheduleIndex], ...scheduleData };
    safeSetItem(STORAGE_KEYS.COURSE_SCHEDULES, schedules);
    return schedules[scheduleIndex];
  }
  
  throw new Error('Schedule not found');
};

export const deleteCourseSchedule = (scheduleId) => {
  initializeData();
  const schedules = safeGetItem(STORAGE_KEYS.COURSE_SCHEDULES, DEFAULT_COURSE_SCHEDULES);
  const filteredSchedules = schedules.filter(s => s.id !== scheduleId);
  safeSetItem(STORAGE_KEYS.COURSE_SCHEDULES, filteredSchedules);
  return true;
};

export const getActiveSessions = () => {
  initializeData();
  const sessions = safeGetItem(STORAGE_KEYS.ACTIVE_SESSIONS, DEFAULT_ACTIVE_SESSIONS);
  const now = new Date();
  return sessions.filter(session => {
    const endTime = new Date(session.end_time);
    return now <= endTime;
  });
};

export const getQRCode = (qrId) => {
  initializeData();
  const qrCodes = safeGetItem(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
  return qrCodes.find(qr => qr.id === qrId);
};

export const markAttendance = (sessionId, userId, status = 'present') => {
  initializeData();
  const attendance = safeGetItem(STORAGE_KEYS.ATTENDANCE, []);
  const existingRecord = attendance.find(
    record => record.session_id === sessionId && record.user_id === userId
  );
  
  if (existingRecord) {
    throw new Error('Attendance already marked for this session');
  }
  
  const newRecord = {
    id: Date.now(),
    session_id: sessionId,
    user_id: userId,
    status,
    check_in_time: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  attendance.push(newRecord);
  safeSetItem(STORAGE_KEYS.ATTENDANCE, attendance);
  
  // Log audit trail
  addAuditLog('ATTENDANCE_MARKED', userId, `Attendance marked for session ${sessionId}`);
  
  return newRecord;
};

// Audit log functions
export const addAuditLog = (action, userId, details, deviceId = null, location = null) => {
  initializeData();
  const auditLogs = safeGetItem(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  const users = safeGetItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
  const user = users.find(u => u.id === userId);
  
  const newLog = {
    id: Date.now(),
    action,
    user_id: userId,
    user_email: user?.email || 'unknown',
    timestamp: new Date().toISOString(),
    device_id: deviceId || 'device-' + Math.random().toString(36).substring(7),
    location: location || { lat: 0, lng: 0 },
    ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
    details
  };
  
  auditLogs.unshift(newLog); // Add to beginning
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  return newLog;
};

export const getAuditLogs = (filters = {}) => {
  initializeData();
  let logs = safeGetItem(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  
  if (filters.action) {
    logs = logs.filter(log => log.action === filters.action);
  }
  if (filters.user_id) {
    logs = logs.filter(log => log.user_id === filters.user_id);
  }
  if (filters.startDate) {
    logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
  }
  
  return logs;
};

// Role functions
export const getRoles = () => {
  initializeData();
  return safeGetItem(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
};

export const getRolePermissions = (roleId) => {
  initializeData();
  const roles = safeGetItem(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
  const role = roles.find(r => r.id === roleId);
  return role?.permissions || [];
};

export const hasPermission = (userRole, permission) => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
};
