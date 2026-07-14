import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Activity, CheckCircle } from 'lucide-react';
import { getSessions } from '../utils/mockData.js';

export default function Calendar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarActivities();
  }, [currentDate]);

  const fetchCalendarActivities = async () => {
    try {
      const sessions = getSessions();
      // Mock calendar activities from sessions
      const mockActivities = sessions.map(session => ({
        date: session.date,
        type: session.status === 'present' ? 'attendance' : 'absence',
        status: session.status
      }));
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching calendar activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getActivityForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.find(a => a.date === dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
            <p className="text-gray-600 mt-2">A quick view of your month and recent activity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before the first day of month */}
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const activity = getActivityForDate(day);
                    const isToday = day === new Date().getDate() && 
                                   currentDate.getMonth() === new Date().getMonth() &&
                                   currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition cursor-pointer hover:shadow-md ${
                          isToday 
                            ? 'border-primary-blue bg-primary-blue/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm font-medium ${isToday ? 'text-primary-blue' : 'text-gray-700'}`}>
                          {day}
                        </span>
                        {activity && (
                          <div className="mt-1 flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary-green rounded-full" />
                            <span className="text-xs text-gray-500">{activity.sessions_count}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Activity Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-blue" />
                  Activity Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary-green rounded-full" />
                      <span className="text-sm text-gray-600">Days with attendance</span>
                    </div>
                    <span className="font-semibold text-gray-800">{activities.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-green" />
                      <span className="text-sm text-gray-600">Total sessions</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {activities.reduce((sum, a) => sum + a.sessions_count, 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary-blue" />
                      <span className="text-sm text-gray-600">Month</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {monthNames[currentDate.getMonth()]}
                    </span>
                  </div>
                </div>

                {activities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {activities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">{activity.date}</span>
                            <span className="text-xs text-primary-green font-medium">
                              {activity.sessions_count} session(s)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {activity.classes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
