import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Clock, Calendar, CheckCircle, XCircle, AlertTriangle, Filter, Download, MapPin, Wifi, QrCode, Camera, X } from 'lucide-react';
import { getSessions, getActiveSessions, markAttendance } from '../utils/mockData.js';
import { checkGeolocation, checkNetworkConnection, checkTimeWindow, validateQRCode } from '../utils/attendanceValidation.js';

export default function Attendance({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [weeklyRecords, setWeeklyRecords] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  // Validation state
  const [validationStatus, setValidationStatus] = useState({
    geolocation: null,
    network: null,
    timeWindow: null,
    qrCode: null
  });
  const [validating, setValidating] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(() => {
      fetchActiveSessions();
    }, 30000); // Refresh active sessions every 30 seconds
    
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAttendanceData = async () => {
    try {
      const sessions = getSessions();
      fetchActiveSessions();
      
      let filteredHistory = sessions;
      if (filter !== 'all') {
        filteredHistory = sessions.filter(record => record.status === filter);
      }

      setHistory(filteredHistory);
      setWeeklyRecords(sessions.slice(0, 7));
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = () => {
    try {
      const sessions = getActiveSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
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

  const handleMarkAttendance = async (session) => {
    setSelectedSession(session);
    setShowQRScanner(true);
    setValidationStatus({
      geolocation: null,
      network: null,
      timeWindow: null,
      qrCode: null
    });
    setAttendanceMarked(false);
    setErrorMessage('');
  };

  const handleScan = async (qrData) => {
    if (!selectedSession) return;
    
    setValidating(true);
    setErrorMessage('');
    
    try {
      // Step 1: Validate QR Code
      const qrValidation = validateQRCode(qrData);
      setValidationStatus(prev => ({ ...prev, qrCode: qrValidation }));
      
      if (!qrValidation.valid) {
        setErrorMessage(qrValidation.reason);
        setValidating(false);
        return;
      }

      // Step 2: Check Time Window
      const timeCheck = checkTimeWindow(selectedSession.start_time, 15);
      setValidationStatus(prev => ({ ...prev, timeWindow: timeCheck }));
      
      if (!timeCheck.isWithinWindow) {
        setErrorMessage('Attendance window has closed');
        setValidating(false);
        return;
      }

      // Step 3: Check Geolocation
      const geoCheck = await checkGeolocation(selectedSession.location, 100);
      setValidationStatus(prev => ({ ...prev, geolocation: geoCheck }));
      
      if (!geoCheck.withinRange) {
        setErrorMessage(`You are not within the required range. Distance: ${Math.round(geoCheck.distance)}m`);
        setValidating(false);
        return;
      }

      // Step 4: Check Network
      const networkCheck = await checkNetworkConnection();
      setValidationStatus(prev => ({ ...prev, network: networkCheck }));
      
      if (!networkCheck.connected) {
        setErrorMessage(networkCheck.reason);
        setValidating(false);
        return;
      }

      // All validations passed - mark attendance
      const attendanceRecord = await markAttendance(selectedSession.id, user.id);
      setAttendanceMarked(true);
      fetchAttendanceData(); // Refresh attendance data
      
    } catch (error) {
      setErrorMessage(error.message || 'Failed to mark attendance');
    } finally {
      setValidating(false);
    }
  };

  const handleManualQRInput = (e) => {
    if (e.key === 'Enter') {
      handleScan(e.target.value);
    }
  };

  const formatTimeRemaining = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Attendance Tracker</h1>
              <p className="text-gray-600 mt-2">View your attendance history and weekly records</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl shadow-lg mb-8 p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6" />
                <h2 className="-xl font-semibold">Active Sessions</h2>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">{activeSessions.length} available</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions.map((session) => {
                  const timeCheck = checkTimeWindow(session.start_time, 15);
                  const isWithinWindow = timeCheck.isWithinWindow;
                  
                  return (
                    <div key={session.id} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{session.class_name}</h3>
                      <p className="text-white/80 text-sm mb-1">{session.session_name}</p>
                      <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {isWithinWindow ? (
                            <span className="text-green-300">
                              Time remaining: {formatTimeRemaining(timeCheck.timeRemaining)}
                            </span>
                          ) : (
                            <span className="text-red-300">Window closed</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleMarkAttendance(session)}
                          disabled={!isWithinWindow}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                            isWithinWindow
                              ? 'bg-white text-primary-blue hover:bg-gray-100'
                              : 'bg-white/30 text-white/50 cursor-not-allowed'
                          }`}
                        >
                          <QrCode className="w-4 h-4" />
                          Mark Attendance
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekly Records */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-blue" />
                Weekly Records
              </h2>
            </div>
            <div className="p-6">
              {weeklyRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                        <th className="text-center py-3 px-4 font-semibold text-primary-green">Present</th>
                        <th className="text-center py-3 px-4 font-semibold text-primary-red">Absent</th>
                        <th className="text-center py-3 px-4 font-semibold text-primary-amber">Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyRecords.map((record, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{record.date}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{record.total_sessions}</td>
                          <td className="py-3 px-4 text-center text-primary-green font-medium">{record.present}</td>
                          <td className="py-3 px-4 text-center text-primary-red font-medium">{record.absent}</td>
                          <td className="py-3 px-4 text-center text-primary-amber font-medium">{record.late}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No weekly records available</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Attendance History</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-medium text-gray-800">{record.class_name}</p>
                          <p className="text-sm text-gray-500">{record.session_name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(record.check_in_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No attendance records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QR Scanner Modal */}
      {showQRScanner && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Mark Attendance</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-1">{selectedSession.class_name}</h4>
                <p className="text-sm text-gray-500">{selectedSession.session_name}</p>
                <p className="text-sm text-gray-400 mt-1">{selectedSession.location.name}</p>
              </div>

              {/* Validation Status */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Time Window</p>
                    {validationStatus.timeWindow ? (
                      <p className={`text-xs ${validationStatus.timeWindow.isWithinWindow ? 'text-green-600' : 'text-red-600'}`}>
                        {validationStatus.timeWindow.isWithinWindow ? '✓ Within window' : '✗ Window closed'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Checking...</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    {validationStatus.geolocation ? (
                      <p className={`text-xs ${validationStatus.geolocation.withinRange ? 'text-green-600' : 'text-red-600'}`}>
                        {validationStatus.geolocation.withinRange 
                          ? '✓ Within range' 
                          : `✗ ${Math.round(validationStatus.geolocation.distance)}m away`}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Checking...</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Wifi className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Network</p>
                    {validationStatus.network ? (
                      <p className={`text-xs ${validationStatus.network.connected ? 'text-green-600' : 'text-red-600'}`}>
                        {validationStatus.network.connected ? '✓ Connected' : '✗ Not connected'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Checking...</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <QrCode className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">QR Code</p>
                    {validationStatus.qrCode ? (
                      <p className={`text-xs ${validationStatus.qrCode.valid ? 'text-green-600' : 'text-red-600'}`}>
                        {validationStatus.qrCode.valid ? '✓ Valid' : '✗ Invalid'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Waiting for scan...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Scanner Area */}
              {!attendanceMarked && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scan QR Code or Enter Manually
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 mb-3">
                      Point your camera at the QR code displayed in class
                    </p>
                    <input
                      type="text"
                      placeholder="Or paste QR code data here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      onKeyDown={handleManualQRInput}
                      disabled={validating}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {attendanceMarked && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">Attendance Marked Successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Your attendance has been recorded.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!attendanceMarked ? (
                  <>
                    <button
                      onClick={() => {
                        // Simulate QR scan for demo
                        const mockQRData = JSON.stringify({
                          sessionId: selectedSession.id,
                          timestamp: new Date().toISOString(),
                          classId: selectedSession.class_id,
                          nonce: 'demo-nonce'
                        });
                        handleScan(mockQRData);
                      }}
                      disabled={validating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Validating...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          Simulate Scan
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowQRScanner(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowQRScanner(false)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
