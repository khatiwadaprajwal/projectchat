import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { Users, MessageSquare, X, ShieldCheck, UserPlus } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0 });
  const [userList, setUserList] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const { socket } = useSocket();

  // 1. Initial Load of Statistics
  useEffect(() => {
    fetchStats();
  }, []);

  // 2. Listen for Real-time Message Updates
  useEffect(() => {
    if (!socket) return;

    socket.on('admin_total_messages_update', (newTotal) => {
      setStats(prev => ({ ...prev, totalMessages: newTotal }));
    });

    return () => socket.off('admin_total_messages_update');
  }, [socket]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/chat/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // 3. Fetch User List and Open Modal
  const handleFetchUsers = async () => {
    try {
      const res = await api.get('/chat/admin/users');
      if (res.data.success) {
        setUserList(res.data.data);
        setShowUserModal(true);
      }
    } catch (err) {
      alert("Error fetching user list");
      console.error(err);
    }
  };

  // 4. Promote User to Admin Logic
  const handlePromote = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to promote "${username}" to Admin?`)) return;

    setIsPromoting(true);
    try {
      const res = await api.patch('/auth/promote', { userId });
      if (res.data.success) {
        alert(`${username} is now an Admin!`);
        // Refresh the list locally
        const updatedList = await api.get('/chat/admin/users');
        setUserList(updatedList.data.data);
        // Refresh stats card
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Promotion failed");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium">Manage your community and view real-time activity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Total Users Card - CLICKABLE */}
        <div 
          onClick={handleFetchUsers}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={120} />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Members</p>
              <h2 className="text-5xl font-black text-slate-800">{stats.totalUsers}</h2>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Users size={28} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
            <span>View all registered users</span>
            <span className="text-lg">→</span>
          </div>
        </div>

        {/* Total Messages Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare size={120} />
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Messages Sent</p>
              <h2 className="text-5xl font-black text-slate-800">{stats.totalMessages}</h2>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <MessageSquare size={28} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Live Updates Enabled</span>
          </div>
        </div>
      </div>

      {/* USER LIST MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Users size={24} />
                  </div> 
                  Member Directory
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Manage user roles and permissions</p>
              </div>
              <button 
                onClick={() => setShowUserModal(false)} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Modal Table Body */}
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status/Role</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userList.map((u) => (
                    <tr key={u._id} className="group hover:bg-indigo-50/30 transition">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm 
                            ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                            {u.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{u.username}</p>
                            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase 
                          ${u.role === 'ADMIN' 
                            ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' 
                            : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'}`}>
                          {u.role === 'ADMIN' && <ShieldCheck size={12} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {u.role !== 'ADMIN' ? (
                          <button 
                            disabled={isPromoting}
                            onClick={() => handlePromote(u._id, u.username)}
                            className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
                          >
                            <UserPlus size={14} />
                            Make Admin
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 italic uppercase">System Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end bg-slate-50/50">
              <button 
                onClick={() => setShowUserModal(false)}
                className="bg-white border border-slate-200 text-slate-700 px-8 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition shadow-sm"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;