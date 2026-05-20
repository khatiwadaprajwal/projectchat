import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <MessageSquare className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              CHAT<span className="text-indigo-600">APP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Global Chat
            </Link>
            {user.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-none">{user.username}</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{user.role}</p>
          </div>
          
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 bg-slate-100 p-2 md:px-4 md:py-2 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            <span className="hidden md:inline text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;