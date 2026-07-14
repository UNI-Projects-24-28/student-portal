import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Lightbulb, Clock, Wifi, User, Calendar, AlertCircle, CheckCircle, XCircle, Target, BookOpen } from 'lucide-react';

export default function Tips({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      // Mock tips data
      const mockTips = [
        { id: 1, icon: 'clock', title: 'Arrive Early', description: 'Try to arrive at least 5-10 minutes before class starts to avoid being marked late.' },
        { id: 2, icon: 'wifi', title: 'Check Connection', description: 'Ensure you have a stable internet connection before checking in to online classes.' },
        { id: 3, icon: 'calendar', title: 'Set Reminders', description: 'Use calendar reminders to never forget important class sessions.' },
        { id: 4, icon: 'alert-circle', title: 'Report Issues', description: 'Immediately report any attendance discrepancies to your instructor.' },
        { id: 5, icon: 'target', title: 'Track Progress', description: 'Regularly check your attendance progress to stay on track.' }
      ];
      setTips(mockTips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'clock': return Clock;
      case 'wifi': return Wifi;
      case 'user': return User;
      case 'calendar': return Calendar;
      case 'alert-circle': return AlertCircle;
      default: return Lightbulb;
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Tips</h1>
            <p className="text-gray-600 mt-2">How to keep your attendance record clean</p>
          </div>

          {/* Main Tips Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary-amber" />
                Attendance Best Practices
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tips.map((tip) => {
                  const Icon = getIcon(tip.icon);
                  return (
                    <div key={tip.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">{tip.title}</h3>
                          <p className="text-sm text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-green" />
                  Do's
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Join classes before the session starts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Keep your Wi-Fi connected for offline sync</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Update your profile details for enrollment checks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Check in on time to avoid late marks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Review your attendance regularly</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary-red" />
                  Don'ts
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Don't wait until the last minute to join classes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Don't ignore pending sync notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Don't share your class codes with others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Don't rely on offline mode for extended periods</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Don't forget to sync before important deadlines</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target Information */}
          <div className="bg-primary-blue/10 border border-primary-blue rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Attendance Target</h4>
                <p className="text-sm text-gray-600">
                  Most institutions require a minimum of 75% attendance to be eligible for exams. 
                  Aim for higher attendance to build a strong academic record and avoid any last-minute issues.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-blue" />
                Quick Reference
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-primary-green/10 rounded-lg border border-primary-green">
                  <h3 className="font-semibold text-primary-green mb-2">90%+</h3>
                  <p className="text-sm text-gray-600">Excellent - Keep up the great work!</p>
                </div>
                <div className="p-4 bg-primary-blue/10 rounded-lg border border-primary-blue">
                  <h3 className="font-semibold text-primary-blue mb-2">75-89%</h3>
                  <p className="text-sm text-gray-600">Good - On track to meet requirements</p>
                </div>
                <div className="p-4 bg-primary-red/10 rounded-lg border border-primary-red">
                  <h3 className="font-semibold text-primary-red mb-2">Below 75%</h3>
                  <p className="text-sm text-gray-600">Critical - Immediate action needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
