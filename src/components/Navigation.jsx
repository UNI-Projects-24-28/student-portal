import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, Clock, BarChart3, RefreshCw, Lightbulb, Brain, LogOut, User, Menu, X, UserCircle, CalendarDays } from 'lucide-react';

export default function Navigation({ user, onLogout, isOpen, setIsOpen }) {
  const location = useLocation();

  const getNavItems = () => {
    return [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/attendance', icon: Clock, label: 'Attendance' },
      { path: '/classes', icon: BookOpen, label: 'Classes' },
      { path: '/sessions', icon: Calendar, label: 'Sessions' },
      { path: '/calendar', icon: Calendar, label: 'Calendar' },
      { path: '/progress', icon: BarChart3, label: 'Progress' },
      { path: '/sync', icon: RefreshCw, label: 'Sync' },
      { path: '/tips', icon: Lightbulb, label: 'Tips' },
      { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
      { path: '/course-schedule', icon: CalendarDays, label: 'Schedule' },
      { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];
  };

  const getPortalName = () => {
    return 'Student Portal';
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-blue text-white rounded-lg shadow-lg hover:bg-blue-700 transition'
        aria-label='Toggle menu'
      >
        {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
      </button>

      {/* Desktop Horizontal Navigation */}
      <nav className='hidden lg:flex items-center justify-between bg-white shadow-md px-6 py-4'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center'>
            <LayoutDashboard className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Attendance</h1>
            <p className='text-xs text-gray-500'>{getPortalName()}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className='flex items-center gap-1'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
                >
                  <Icon className='w-5 h-5' />
                  <span className='hidden xl:inline'>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User info and logout */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center'>
              <User className='w-5 h-5 text-white' />
            </div>
            <div className='text-right hidden md:block'>
              <p className='font-medium text-gray-800'>{user?.full_name || 'Student'}</p>
              <p className='text-xs text-gray-500'>{user?.student_id || ''}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className='flex items-center gap-2 px-4 py-2 text-primary-red hover:bg-red-50 rounded-lg transition font-medium'
            aria-label='Logout'
          >
            <LogOut className='w-4 h-4' />
            <span className='hidden md:inline'>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center'>
                <LayoutDashboard className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>Attendance</h1>
                <p className='text-xs text-gray-500'>{getPortalName()}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 overflow-y-auto p-4'>
            <ul className='space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition"
                    >
                      <Icon className='w-5 h-5' />
                      <span className='font-medium'>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className='p-4 border-t border-gray-200'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-primary-cyan rounded-full flex items-center justify-center'>
                <User className='w-5 h-5 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-gray-800 truncate'>{user?.full_name || 'Student'}</p>
                <p className='text-xs text-gray-500 truncate'>{user?.student_id || ''}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className='w-full flex items-center justify-center gap-2 px-4 py-2 text-primary-red hover:bg-red-50 rounded-lg transition'
            >
              <LogOut className='w-4 h-4' />
              <span className='font-medium'>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
