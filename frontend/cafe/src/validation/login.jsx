import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg[e.target.name] || errorMsg.general) {
      setErrorMsg((prev) => ({ ...prev, [e.target.name]: null, general: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg({});
    setSuccessMsg('');

    let newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorMsg(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${API}/api/login`, formData);

      // Check common token property locations from different backend patterns
      const receivedToken = 
        res.data.token || 
        res.data.jwtToken || 
        res.data.accessToken || 
        res.data.data?.token;

      if (receivedToken) {
        // Store under the key read by UserProfileCard & TopHeader
        localStorage.setItem('adminToken', receivedToken);
        setSuccessMsg('Login successful! Redirecting...');
        
        setTimeout(() => {
          navigate('/admin');
        }, 800);
      } else {
        console.error('Login succeeded but no token found in response:', res.data);
        setErrorMsg({ general: 'Authentication failed: Token missing from response.' });
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data || error);
      if (error.response?.data?.errors) {
        setErrorMsg(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrorMsg({ general: error.response.data.message });
      } else {
        setErrorMsg({ general: 'Invalid email or password. Please check your connection.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0A4D8C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6DBE45]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden z-10">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0A4D8C] via-[#083c6e] to-[#0A4D8C] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(109,190,69,0.3),transparent_50%)]" />
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#6DBE45]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-200 mt-1">Enter your credentials to access the dashboard</p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              {successMsg}
            </div>
          )}
          {errorMsg.general && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {errorMsg.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
              {errorMsg.email && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errorMsg.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset feature placeholder')}
                  className="text-[11px] font-semibold text-[#0A4D8C] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg.password && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errorMsg.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0A4D8C] hover:bg-[#083c6e] active:scale-[0.99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0A4D8C]/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#6DBE45]" />
                </>
              )}
            </button>
          </form>

          {/* Switch Page */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-[#0A4D8C] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}