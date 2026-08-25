import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  LogOut, 
  CheckCircle2, 
  Calendar,
  X,
  Loader2,
  AlertCircle,
  Camera,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfileCard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Component States
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL;

  // Form State & Errors
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', avatarUrl: '', role: 'admin' });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');

  // Fetch Admin Profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          token: token,
          'x-auth-token': token
        }
      });

      const user = res.data.user || res.data;
      if (user) {
        setUserData(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatarUrl: user.avatarUrl || '',
          role: user.role || 'admin'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Backend response message:', error.response?.data);

      if (error.response?.status === 401 || error.response?.status === 403) {
        setServerMsg(error.response?.data?.message || 'Authentication session invalid. Please log in again.');
      } else {
        setServerMsg('Failed to connect to backend server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Handle Photo File Pick
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, avatarUrl: 'Image size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
        setErrors((prev) => ({ ...prev, avatarUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit
  // Handle Form Submit
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setServerMsg('');

    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.put(`${API}/api/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          token: token,
          'x-auth-token': token
        }
      });

      if (res.data.success || res.data.user) {
        setUserData(res.data.user || formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update profile error response:', error.response?.data);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const errorText = 
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Failed to update profile. Please try again.';
        setServerMsg(errorText);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0A4D8C] animate-spin" />
      </div>
    );
  }

  const userRoleFormatted = userData?.role === 'manager' ? 'Store Manager' : 'Administrator';

  return (
    <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden relative">
        
        {/* Banner Header */}
        <div className="h-32 bg-gradient-to-r from-[#0A4D8C] via-[#083c6e] to-[#0A4D8C] relative p-4 flex justify-between items-start">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(109,190,69,0.25),transparent_50%)]" />
          
          <button
            onClick={() => navigate('/admin')}
            className="relative z-10 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md bg-white/15 text-white border border-white/20 hover:bg-white/25 transition cursor-pointer"
          >
            ← Back to Admin
          </button>

          <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/15 text-white border border-white/20 shadow-xs">
            {userData?.role === 'manager' ? <UserCheck className="w-3.5 h-3.5 text-[#6DBE45]" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#6DBE45]" />}
            {userRoleFormatted}
          </span>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar & Action Section */}
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="relative">
              <img
                src={userData?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"}
                alt={userData?.name || "Admin"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-md bg-slate-100"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#6DBE45] border-2 border-white rounded-full flex items-center justify-center shadow-xs" title="Active">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <button 
              onClick={() => {
                setFormData({
                  name: userData?.name || '',
                  email: userData?.email || '',
                  phone: userData?.phone || '',
                  avatarUrl: userData?.avatarUrl || '',
                  role: userData?.role || 'admin'
                });
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0A4D8C] bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* User Name & Status */}
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {userData?.name || 'Admin User'}
              </h2>
              <ShieldCheck className="w-5 h-5 text-[#0A4D8C]" />
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'August 2026'}
            </p>
          </div>

          {/* Server Error / Warning Notice */}
          {serverMsg && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="flex-1">{serverMsg}</span>
            </div>
          )}

          {/* Information Cards List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#0A4D8C]/10 text-[#0A4D8C] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{userData?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#6DBE45]/15 text-[#4a892b] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone Number</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{userData?.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0A4D8C]/10 text-[#0A4D8C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Admin Level</p>
                  <p className="text-sm font-semibold text-slate-800">{userRoleFormatted}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0A4D8C]/10 text-[#0A4D8C] border border-[#0A4D8C]/20 uppercase">
                {userData?.role || 'admin'}
              </span>
            </div>

            {/* Logout Action */}
            <div className="pt-3">
              <button 
                onClick={handleLogOut}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* --- EDIT PROFILE MODAL --- */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">Update Profile</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Photo Upload Picker */}
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img
                      src={formData.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-[#0A4D8C]/20"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs font-semibold text-[#0A4D8C] hover:underline cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {errors.avatarUrl && <p className="text-xs text-rose-500 mt-1">{errors.avatarUrl}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C]"
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C]"
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C]"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                {/* --- ROLE SELECTOR DROPDOWN --- */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Account Level</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C] cursor-pointer"
                  >
                    <option value="admin">Admin (Full Access)</option>
                    <option value="manager">Manager (Store Management)</option>
                  </select>
                  {errors.role && <p className="text-xs text-rose-500 mt-1">{errors.role}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0A4D8C] hover:bg-[#083c6e] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}