import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Clock, MapPin, Plus, Edit2, Trash2, Save, X, Bell, AlertCircle } from 'lucide-react';
import { scheduleAPI } from '../services/api.js';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CourseSchedule({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    day_of_week: 'Monday',
    start_time: '',
    end_time: '',
    venue: '',
    reminder_note: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await scheduleAPI.getAll();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingSchedule) {
        await scheduleAPI.update(editingSchedule.id, formData);
        setMessage({ type: 'success', text: 'Schedule updated successfully!' });
      } else {
        await scheduleAPI.create(formData);
        setMessage({ type: 'success', text: 'Schedule added successfully!' });
      }
      
      setShowForm(false);
      setEditingSchedule(null);
      setFormData({
        course_name: '',
        course_code: '',
        day_of_week: 'Monday',
        start_time: '',
        end_time: '',
        venue: '',
        reminder_note: ''
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      setMessage({ type: 'error', text: 'Failed to save schedule. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      course_name: schedule.course_name,
      course_code: schedule.course_code,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      venue: schedule.venue,
      reminder_note: schedule.reminder_note || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await scheduleAPI.delete(id);
      setMessage({ type: 'success', text: 'Schedule deleted successfully!' });
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setMessage({ type: 'error', text: 'Failed to delete schedule. Please try again.' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
    setFormData({
      course_name: '',
      course_code: '',
      day_of_week: 'Monday',
      start_time: '',
      end_time: '',
      venue: '',
      reminder_note: ''
    });
  };

  const groupedSchedules = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.day_of_week === day);
    return acc;
  }, {});

  if (loading && schedules.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-800">Course Schedule</h1>
              <p className="text-gray-600 mt-2">Manage your weekly course schedule and reminders</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-primary-green/10 text-primary-green border border-primary-green' 
                : 'bg-primary-red/10 text-primary-red border border-primary-red'
            }`}>
              {message.type === 'success' ? (
                <Bell className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Add/Edit Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingSchedule ? 'Edit Course Schedule' : 'Add Course Schedule'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                    <input
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      placeholder="e.g., CS101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                    <select
                      name="day_of_week"
                      value={formData.day_of_week}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none"
                      placeholder="e.g., Lecture Hall A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Note (Optional)</label>
                    <textarea
                      name="reminder_note"
                      value={formData.reminder_note}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none resize-none"
                      placeholder="e.g., Bring laptop, Chapter 5 quiz"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingSchedule ? 'Update' : 'Add'} Schedule
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="bg-primary-blue text-white p-3 text-center flex-shrink-0">
                  <h3 className="font-semibold text-sm">{day}</h3>
                  <p className="text-xs opacity-80">{groupedSchedules[day]?.length || 0} classes</p>
                </div>
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {groupedSchedules[day]?.length > 0 ? (
                    groupedSchedules[day].map(schedule => (
                      <div key={schedule.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{schedule.course_code}</h4>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="p-1 text-primary-blue hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-1 text-primary-red hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{schedule.course_name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{schedule.start_time} - {schedule.end_time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{schedule.venue}</span>
                        </div>
                        {schedule.reminder_note && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-primary-amber italic">"{schedule.reminder_note}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 text-xs py-4">
                      No classes
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
