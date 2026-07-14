import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { BookOpen, Plus, Search, CheckCircle, XCircle, Users, Calendar } from 'lucide-react';
import { getClasses } from '../utils/mockData.js';

export default function Classes({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const fetchEnrolledClasses = async () => {
    try {
      const data = getClasses();
      setEnrolledClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;

    setJoining(true);
    setMessage('');

    try {
      // Mock join - just show success message
      setMessage({ type: 'success', text: 'Successfully joined class!' });
      setClassCode('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to join class. Please try again.' });
    } finally {
      setJoining(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
            <p className="text-gray-600 mt-2">Manage your class enrollments</p>
          </div>

          {/* Join Class Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-blue" />
                Join a Class
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Paste the code from your lecturer to enroll instantly.</p>
              
              <form onSubmit={handleJoinClass} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Enter class code (e.g., CS101-2024)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={joining}
                  className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {joining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Join Class
                    </>
                  )}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-primary-green/10 text-primary-green border border-primary-green' 
                    : 'bg-primary-red/10 text-primary-red border border-primary-red'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-blue" />
                  Enrolled Classes
                </h2>
                <span className="text-sm text-gray-500">{enrolledClasses.length} classes</span>
              </div>
            </div>
            <div className="p-6">
              {enrolledClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledClasses.map((classItem) => (
                    <div key={classItem.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary-blue" />
                        </div>
                        <span className="px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-medium">
                          Enrolled
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{classItem.class_name}</h3>
                      <p className="text-sm text-gray-500 mb-1">Code: {classItem.class_code}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {classItem.lecturer_name && `Lecturer: ${classItem.lecturer_name}`}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Enrolled {new Date(classItem.enrolled_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No classes enrolled yet</p>
                  <p className="text-sm mt-2">Join a class using the code from your lecturer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
