import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { RefreshCw, Wifi, WifiOff, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function Sync({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingItems();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchPendingItems = async () => {
    try {
      // Mock pending items - return empty array for frontend-only
      setPendingItems([]);
    } catch (error) {
      console.error('Error fetching pending items:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      setMessage({ type: 'error', text: 'You are offline. Please connect to the internet.' });
      return;
    }

    setSyncing(true);
    setMessage('');

    try {
      // Mock sync - just show success
      setMessage({ type: 'success', text: 'Sync completed successfully!' });
      setPendingItems([]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Sync failed. Please try again.' });
    } finally {
      setSyncing(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pending Sync</h1>
            <p className="text-gray-600 mt-2">Your offline attendance jobs are queued here</p>
          </div>

          {/* Connection Status */}
          <div className={`mb-8 p-6 rounded-xl border-2 ${
            isOnline 
              ? 'bg-primary-green/10 border-primary-green' 
              : 'bg-primary-amber/10 border-primary-amber'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-primary-green' : 'bg-primary-amber'
              }`}>
                {isOnline ? (
                  <Wifi className="w-6 h-6 text-white" />
                ) : (
                  <WifiOff className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {isOnline ? 'You are online' : 'You are offline'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOnline 
                    ? 'Your attendance will sync automatically' 
                    : 'Attendance records will be queued for sync when you reconnect'}
                </p>
              </div>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary-blue" />
                  Sync Queue
                </h2>
                <span className="text-sm text-gray-500">{pendingItems.length} items pending</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">
                    {pendingItems.length > 0 
                      ? `${pendingItems.length} attendance record(s) waiting to sync`
                      : 'All records are synced'}
                  </span>
                </div>
                <button
                  onClick={handleSync}
                  disabled={syncing || pendingItems.length === 0 || !isOnline}
                  className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Sync Now
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
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

              {/* Pending Items List */}
              {pendingItems.length > 0 ? (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-amber/10 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-primary-amber" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.class_name || 'Unknown Class'}</p>
                            <p className="text-sm text-gray-500">{item.session_name || 'Session'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'present' 
                            ? 'bg-primary-green/10 text-primary-green' 
                            : 'bg-primary-red/10 text-primary-red'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <AlertCircle className="w-3 h-3" />
                        <span>Queued: {formatTime(item.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary-green" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm mt-1">No pending sync items</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-primary-blue/10 border border-primary-blue rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How Offline Sync Works</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• When you're offline, attendance records are saved locally</li>
                  <li>• Records are automatically queued for sync when you reconnect</li>
                  <li>• Click "Sync Now" to manually trigger the sync process</li>
                  <li>• Make sure you have a stable internet connection for best results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
