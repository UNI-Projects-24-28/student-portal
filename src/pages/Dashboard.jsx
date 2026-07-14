import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Clock, BookOpen, Calendar, BarChart3, RefreshCw, CheckCircle, XCircle, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import { classesAPI, sessionsAPI, attendanceAPI } from '../services/api.js';

export default function Dashboard({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [openSessions, setOpenSessions] = useState([]);
  const [pendingSync, setPendingSync] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard mounted');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      setError(null);
      const classes = await classesAPI.getAll();
      const sessions = await sessionsAPI.getAll();
      const attendance = await attendanceAPI.getAll();
      const activeSessions = await sessionsAPI.getActive();
      console.log('Data fetched:', { classes, sessions, attendance, activeSessions });
      
      // Calculate real stats from attendance data
      const presentCount = sessions.filter(s => s.status === 'present').length;
      const absentCount = sessions.filter(s => s.status === 'absent').length;
      const lateCount = sessions.filter(s => s.status === 'late').length;
      const totalSessions = sessions.length;
      const attendancePercentage = totalSessions > 0 
        ? Math.round((presentCount / totalSessions) * 100) 
        : 0;
      
      const progress = {
        total_sessions: totalSessions,
        present_count: presentCount,
        absent_count: absentCount,
        late_count: lateCount,
        attendance_percentage: attendancePercentage
      };
      
      console.log('Setting stats:', progress);
      setStats(progress);
      setRecentHistory(sessions.slice(0, 5));
      setOpenSessions(activeSessions.slice(0, 3));
      setPendingSync([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-primary-green" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-primary-red" />;
      case 'late':
        return <AlertTriangle className="w-5 h-5 text-primary-amber" />;
      default:
        return <Clock className="w-5 h-5 text-primary-cyan" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-primary-green/10 text-primary-green border-primary-green';
      case 'absent':
        return 'bg-primary-red/10 text-primary-red border-primary-red';
      case 'late':
        return 'bg-primary-amber/10 text-primary-amber border-primary-amber';
      default:
        return 'bg-primary-cyan/10 text-primary-cyan border-primary-cyan';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertTriangle className="w-16 h-16 text-primary-red mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering, loading:', loading, 'error:', error, 'stats:', stats);

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-gray-600 mt-2">Here's your attendance overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 card-hover animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary-blue" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Total Sessions</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats?.total_sessions || 0}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-green/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-green" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Present</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats?.present_count || 0}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-red/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-red" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Absent</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats?.absent_count || 0}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 card-hover animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-amber/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-primary-amber" />
                </div>
                <span className="text-xs md:text-sm text-gray-500">Late</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats?.late_count || 0}</p>
            </div>
          </div>

          {/* Attendance Percentage */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary-blue" />
                <h2 className="text-xl font-semibold text-gray-800">Attendance Rate</h2>
              </div>
              <span className="text-3xl font-bold text-primary-blue">{stats?.attendance_percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${stats?.attendance_percentage || 0}%`,
                  backgroundColor: stats?.attendance_percentage >= 75 ? '#10B981' : stats?.attendance_percentage >= 50 ? '#F59E0B' : '#EF4444'
                }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Link to="/sessions" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center group-hover:bg-primary-green/20 transition">
                  <Clock className="w-6 h-6 text-primary-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Open Sessions</h3>
                  <p className="text-sm text-gray-500">{openSessions.length} available</p>
                </div>
              </div>
            </Link>

            <Link to="/classes" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in group" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center group-hover:bg-primary-blue/20 transition">
                  <BookOpen className="w-6 h-6 text-primary-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Join Class</h3>
                  <p className="text-sm text-gray-500">Enroll with code</p>
                </div>
              </div>
            </Link>

            <Link to="/sync" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in group" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-amber/10 rounded-lg flex items-center justify-center group-hover:bg-primary-amber/20 transition">
                  <RefreshCw className="w-6 h-6 text-primary-amber" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Pending Sync</h3>
                  <p className="text-sm text-gray-500">{pendingSync.length} items</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent History</h2>
                <Link to="/attendance" className="text-primary-blue hover:underline text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-4 md:p-6">
              {recentHistory.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {recentHistory.map((record) => (
                    <div key={record.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2">
                      <div className="flex items-center gap-3 md:gap-4">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-medium text-gray-800 text-sm md:text-base">{record.class_name}</p>
                          <p className="text-sm text-gray-500">{record.session_name}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-row items-center justify-between sm:gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        <p className="text-xs text-gray-500 sm:mt-0 mt-1">
                          {new Date(record.check_in_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No attendance records yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
