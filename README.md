# Student Attendance Portal

A complete student attendance tracking system with smart features, designed for easy backend integration.

## Features

- **Authentication**: Sign in/Sign up with secure JWT tokens
- **Attendance Tracking**: Weekly records with present/absent status
- **Class Enrollment**: Join classes using lecturer codes
- **Live Sessions**: Real-time check-in for active classes
- **Offline Sync**: Queue attendance records when offline
- **Calendar View**: Monthly activity overview
- **Progress Summary**: Attendance statistics and insights
- **AI Integration**: Smart activity monitoring
- **Profile Management**: Students can edit their personal information
- **Modern UI**: Clean, professional design with color-coded states
- **Mobile Responsive**: Fully responsive design with hamburger menu
- **API-Ready**: Structured for easy backend integration

## Quick Start

### Frontend Only (Mock Data Mode)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

4. Test credentials:
```
Email: student@university.edu
Password: password
```

### With Backend Integration

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=false
```

4. Start your backend server (see Backend Integration section below)

5. Start development server:
```bash
npm run dev
```

## Backend Integration

This frontend is designed to work seamlessly with a RESTful API backend. The project includes:

### API Service Layer

All API calls are centralized in `src/services/api.js`, which provides:
- Automatic mock data fallback for development
- JWT token management
- Error handling
- Easy switching between mock and real API

### Environment Configuration

Configure the following environment variables in `.env`:

```env
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=true  # Set to false when using real backend
```

### API Endpoints

The frontend expects the following API endpoints. See `API_DOCUMENTATION.md` for detailed specifications:

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

**Classes:**
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class (admin)
- `GET /api/classes/:id` - Get specific class
- `PUT /api/classes/:id` - Update class (admin)
- `DELETE /api/classes/:id` - Delete class (admin)

**Sessions:**
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/active` - Get active sessions
- `POST /api/sessions` - Create session (lecturer/admin)
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session (lecturer/admin)
- `DELETE /api/sessions/:id` - Delete session (lecturer/admin)

**Attendance:**
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/session/:sessionId` - Get session attendance
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

**User Profile:**
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

**AI Insights:**
- `GET /api/insights` - Get AI insights
- `POST /api/insights/generate` - Generate new insights

### Authentication

The frontend uses JWT tokens for authentication:
- Token is stored in `localStorage` under key `token`
- User data is stored in `localStorage` under key `user`
- All API requests include the token in the `Authorization` header: `Bearer <token>`

### Data Models

Refer to `API_DOCUMENTATION.md` for complete data model specifications for:
- User
- Class
- Session
- Attendance
- Insight

### Backend Implementation Checklist

When implementing the backend, ensure:

1. **CORS Configuration**: Enable CORS for your frontend URL
2. **JWT Authentication**: Implement JWT token generation and validation
3. **Error Handling**: Return consistent error responses with `message` field
4. **Validation**: Validate all input data on the backend
5. **Database**: Set up database models matching the data structures
6. **Rate Limiting**: Implement rate limiting for security
7. **HTTPS**: Use HTTPS in production

### Testing the Backend

1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. Start your backend server
3. Start the frontend: `npm run dev`
4. Test login with backend credentials
5. Verify all features work with real API calls

## Project Structure

```
student-portal/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navigation.jsx  # Navigation component
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Attendance.jsx
│   │   ├── Classes.jsx
│   │   ├── Sessions.jsx
│   │   ├── Calendar.jsx
│   │   ├── Progress.jsx
│   │   ├── Sync.jsx
│   │   ├── Tips.jsx
│   │   ├── AIInsights.jsx
│   │   └── Profile.jsx
│   ├── services/           # API service layer
│   │   └── api.js         # Central API calls
│   ├── utils/              # Utility functions
│   │   ├── mockData.js     # Mock data for development
│   │   └── attendanceValidation.js
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── API_DOCUMENTATION.md   # Detailed API specifications
├── package.json           # Dependencies
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies

- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **date-fns** - Date utilities

## Color Scheme

- **Blue**: Trust, professionalism, education
- **Green**: Successful actions, student presence
- **Amber**: Warnings, late attendance
- **Red**: Errors, deletions, absences
- **Cyan**: Informational states, excused absences

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The frontend uses mock data by default for easy development
- Switch to real API by setting `VITE_USE_MOCK_DATA=false`
- All API calls are centralized in `src/services/api.js`
- The project is fully responsive and mobile-friendly
- Console logs are included for debugging purposes

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the `dist/` directory to your hosting service

4. Ensure your backend is configured to serve the frontend or use a reverse proxy

5. Update `VITE_API_BASE_URL` to your production API URL

## Support

For detailed API specifications, see `API_DOCUMENTATION.md`

## License

This project is provided as-is for educational and development purposes.
