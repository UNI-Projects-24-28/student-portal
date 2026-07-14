import { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import { scheduleAPI } from '../services/api.js';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function LectureReminder() {
  const [nextLecture, setNextLecture] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNextLecture();
    // Refresh every minute
    const interval = setInterval(fetchNextLecture, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNextLecture = async () => {
    try {
      const schedules = await scheduleAPI.getAll();
      const next = getNextLecture(schedules);
      setNextLecture(next);
    } catch (error) {
      console.error('Error fetching next lecture:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextLecture = (schedules) => {
    if (!schedules || schedules.length === 0) return null;

    const now = new Date();
    const currentDay = DAYS_OF_WEEK[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Get today's schedules
    const todaySchedules = schedules.filter(s => s.day_of_week === currentDay);
    
    // Find next lecture today
    const nextToday = todaySchedules
      .filter(s => {
        const [hours, minutes] = s.start_time.split(':').map(Number);
        const scheduleMinutes = hours * 60 + minutes;
        return scheduleMinutes > currentTime;
      })
      .sort((a, b) => {
        const [aHours, aMinutes] = a.start_time.split(':').map(Number);
        const [bHours, bMinutes] = b.start_time.split(':').map(Number);
        return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
      })[0];

    if (nextToday) {
      return { ...nextToday, isToday: true };
    }

    // Find first lecture tomorrow
    const tomorrowIndex = (now.getDay() + 1) % 7;
    const tomorrowDay = DAYS_OF_WEEK[tomorrowIndex];
    const tomorrowSchedules = schedules.filter(s => s.day_of_week === tomorrowDay);
    
    if (tomorrowSchedules.length > 0) {
      const firstTomorrow = tomorrowSchedules.sort((a, b) => {
        const [aHours, aMinutes] = a.start_time.split(':').map(Number);
        const [bHours, bMinutes] = b.start_time.split(':').map(Number);
        return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
      })[0];
      
      return { ...firstTomorrow, isToday: false };
    }

    // Find next lecture in the week
    for (let i = 1; i <= 6; i++) {
      const nextDayIndex = (now.getDay() + i) % 7;
      const nextDay = DAYS_OF_WEEK[nextDayIndex];
      const daySchedules = schedules.filter(s => s.day_of_week === nextDay);
      
      if (daySchedules.length > 0) {
        const firstOfDay = daySchedules.sort((a, b) => {
          const [aHours, aMinutes] = a.start_time.split(':').map(Number);
          const [bHours, bMinutes] = b.start_time.split(':').map(Number);
          return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
        })[0];
        
        return { ...firstOfDay, isToday: false, daysUntil: i };
      }
    }

    return null;
  };

  const getTimeUntilLecture = () => {
    if (!nextLecture) return null;

    const now = new Date();
    const [hours, minutes] = nextLecture.start_time.split(':').map(Number);
    
    let lectureDate = new Date();
    lectureDate.setHours(hours, minutes, 0, 0);

    if (!nextLecture.isToday) {
      const currentDayIndex = now.getDay();
      const lectureDayIndex = DAYS_OF_WEEK.indexOf(nextLecture.day_of_week);
      const daysToAdd = lectureDayIndex > currentDayIndex 
        ? lectureDayIndex - currentDayIndex 
        : 7 - currentDayIndex + lectureDayIndex;
      
      lectureDate.setDate(lectureDate.getDate() + daysToAdd);
    }

    const diff = lectureDate - now;
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursUntil > 24) {
      const daysUntil = Math.floor(hoursUntil / 24);
      return `${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
    }

    if (hoursUntil > 0) {
      return `${hoursUntil}h ${minutesUntil}m`;
    }

    return `${minutesUntil} min`;
  };

  const isUrgent = () => {
    if (!nextLecture || !nextLecture.isToday) return false;
    
    const now = new Date();
    const [hours, minutes] = nextLecture.start_time.split(':').map(Number);
    const scheduleMinutes = hours * 60 + minutes;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return (scheduleMinutes - currentMinutes) <= 30; // Urgent if within 30 minutes
  };

  if (loading || dismissed || !nextLecture) return null;

  const timeUntil = getTimeUntilLecture();
  const urgent = isUrgent();

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slideIn ${
      urgent ? 'bg-primary-red text-white' : 'bg-primary-blue text-white'
    } rounded-xl shadow-2xl p-4`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition"
        aria-label="Dismiss reminder"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${urgent ? 'bg-white/20' : 'bg-white/20'}`}>
          {urgent ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">Upcoming Lecture</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {timeUntil}
            </span>
          </div>
          
          <h4 className="font-bold text-base mb-1">{nextLecture.course_code}</h4>
          <p className="text-sm opacity-90 mb-2">{nextLecture.course_name}</p>
          
          <div className="flex items-center gap-4 text-xs opacity-80">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{nextLecture.start_time} - {nextLecture.end_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{nextLecture.venue}</span>
            </div>
          </div>
          
          {nextLecture.reminder_note && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs italic opacity-90">"{nextLecture.reminder_note}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
