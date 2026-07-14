import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { BarChart3, TrendingUp, TrendingDown, Award, AlertTriangle, Target, Calendar } from 'lucide-react';
import { getSessions } from '../utils/mockData.js';

export default function Progress({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const sessions = getSessions();
      
      // Calculate real progress data from sessions
      const presentCount = sessions.filter(s => s.status === 'present').length;
      const absentCount = sessions.filter(s => s.status === 'absent').length;
      const lateCount = sessions.filter(s => s.status === 'late').length;
      const totalSessions = sessions.length;
      const attendancePercentage = totalSessions > 0 
        ? Math.round((presentCount / totalSessions) * 100) 
        : 0;
      
      const progressData = {
        attendance_percentage: attendancePercentage,
        present_count: presentCount,
        absent_count: absentCount,
        late_count: lateCount,
        total_sessions: totalSessions
      };
      
      setProgress(progressData);
      setWeeklyData(sessions.slice(0, 7));
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return { status: 'Excellent', bgColor: 'bg-primary-green/10', textColor: 'text-primary-green', icon: Award };
    if (percentage >= 75) return { status: 'Good', bgColor: 'bg-primary-blue/10', textColor: 'text-primary-blue', icon: TrendingUp };
    if (percentage >= 50) return { status: 'Needs Improvement', bgColor: 'bg-primary-amber/10', textColor: 'text-primary-amber', icon: AlertTriangle };
    return { status: 'Critical', bgColor: 'bg-primary-red/10', textColor: 'text-primary-red', icon: TrendingDown };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const attendanceStatus = getAttendanceStatus(progress?.attendance_percentage || 0);
  const StatusIcon = attendanceStatus.icon;

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Progress</h1>
            <p className="text-gray-600 mt-2">Attendance summary and performance tracking</p>
          </div>

          {/* Main Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-blue" />
                Overall Attendance
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${attendanceStatus.bgColor} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-8 h-8 ${attendanceStatus.textColor}`} />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-800">
                      {progress?.attendance_percentage || 0}%
                    </p>
                    <p className={`text-sm font-medium ${attendanceStatus.textColor}`}>
                      {attendanceStatus.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Target: 75%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      attendanceStatus.textColor === 'text-primary-green' ? 'bg-primary-green' :
                      attendanceStatus.textColor === 'text-primary-blue' ? 'bg-primary-blue' :
                      attendanceStatus.textColor === 'text-primary-amber' ? 'bg-primary-amber' : 'bg-primary-red'
                    }`}
                    style={{ width: `${progress?.attendance_percentage || 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-800">{progress?.total_sessions || 0}</p>
                  <p className="text-sm text-gray-500">Total Sessions</p>
                </div>
                <div className="p-4 bg-primary-green/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary-green">{progress?.present_count || 0}</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="p-4 bg-primary-red/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary-red">{progress?.absent_count || 0}</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
                <div className="p-4 bg-primary-amber/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary-amber">{progress?.late_count || 0}</p>
                  <p className="text-sm text-gray-600">Late</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-blue" />
                Weekly Progress
              </h2>
            </div>
            <div className="p-6">
              {weeklyData.length > 0 ? (
                <div className="space-y-4">
                  {weeklyData.map((day, index) => {
                    const dayPercentage = day.total_sessions > 0 
                      ? Math.round((day.present / day.total_sessions) * 100) 
                      : 0;
                    
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{day.date}</span>
                          <span className="text-sm text-gray-500">
                            {day.present}/{day.total_sessions} sessions ({dayPercentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              dayPercentage >= 75 ? 'bg-primary-green' : 
                              dayPercentage >= 50 ? 'bg-primary-amber' : 'bg-primary-red'
                            }`}
                            style={{ width: `${dayPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No weekly data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-primary-blue/10 border border-primary-blue rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {(progress?.attendance_percentage || 0) < 75 && (
                    <li>• Your attendance is below the target. Focus on attending upcoming sessions.</li>
                  )}
                  {(progress?.late_count || 0) > 2 && (
                    <li>• Try to arrive on time to reduce late marks.</li>
                  )}
                  {(progress?.absent_count || 0) > 3 && (
                    <li>• You have several absences. Consider reviewing your schedule.</li>
                  )}
                  {(progress?.attendance_percentage || 0) >= 90 && (
                    <li>• Excellent attendance! Keep up the great work.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
