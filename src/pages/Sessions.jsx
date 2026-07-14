import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Clock, CheckCircle, AlertCircle, MapPin, Calendar, Users } from 'lucide-react';
import { getClasses, addAttendance } from '../utils/mockData.js';

export default function Sessions({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSessions, setOpenSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOpenSessions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOpenSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOpenSessions = async () => {
    try {
      const classes = getClasses();
      // Mock open sessions from classes
      const mockSessions = classes.map(cls => ({
        id: cls.id,
        class_name: cls.name,
        class_code: cls.code,
        location: 'Room ' + cls.id,
        start_time: cls.schedule,
        status: 'open'
      }));
      setOpenSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (sessionId) => {
    setCheckingIn(sessionId);
    setMessage('');

    try {
      // Mock check-in
      addAttendance({ session_id: sessionId, status: 'present' });
      setMessage({ type: 'success', text: 'Successfully checked in!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Check-in failed. Please try again.' });
    } finally {
      setCheckingIn(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Open Sessions</h1>
            <p className="text-gray-600 mt-2">Available check-in sessions for your enrolled classes</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-primary-green/10 text-primary-green border border-primary-green' 
                : 'bg-primary-red/10 text-primary-red border border-primary-red'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Sessions Grid */}
          {openSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary-green" />
                      </div>
                      <span className="px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-medium animate-pulse">
                        Live Now
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{session.session_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{session.class_name}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary-blue" />
                        <span>{formatDate(session.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-primary-blue" />
                        <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-primary-blue" />
                        <span>{session.lecturer_name || 'Lecturer'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckIn(session.id)}
                      disabled={checkingIn === session.id}
                      className="w-full py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {checkingIn === session.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Checking in...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Check In
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Open Sessions</h3>
              <p className="text-gray-500 mb-6">There are no active check-in sessions at the moment.</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Sessions will appear here when they become available</span>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-primary-blue/10 border border-primary-blue rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Session Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sessions are only available during their scheduled time</li>
                  <li>• You must be enrolled in the class to check in</li>
                  <li>• Check-in is recorded instantly when you click the button</li>
                  <li>• Make sure you're connected to the internet for real-time sync</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
