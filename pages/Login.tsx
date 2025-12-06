import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bell } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101922] p-4 font-sans">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-[#192633]">
        
        {/* Branding Side */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#137fec]/20 to-[#101922] relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#137fec] rounded-xl">
                <Bell className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white">NotifyHub</h1>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Quản lý thông báo <br />
              <span className="text-[#137fec]">Hiệu quả & Tập trung</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Nền tảng giúp bạn kết nối với khách hàng qua Zalo, Telegram và Email một cách dễ dàng.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-[#111a22]">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </h2>
            <p className="text-[#92adc9] mb-8">
              Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
            </p>

            {/* Toggle */}
            <div className="flex p-1 bg-[#233648] rounded-lg mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  isLogin ? 'bg-[#137fec] text-white shadow' : 'text-[#92adc9] hover:text-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  !isLogin ? 'bg-[#137fec] text-white shadow' : 'text-[#92adc9] hover:text-white'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">
                  Email hoặc Tên đăng nhập
                </label>
                <input
                  type="text"
                  placeholder="admin@example.com"
                  className="w-full h-12 px-4 rounded-lg bg-[#192633] border border-[#233648] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 rounded-lg bg-[#192633] border border-[#233648] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#192633] text-[#137fec] focus:ring-[#137fec]" />
                    <span className="text-sm text-[#92adc9]">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-[#137fec] hover:text-[#137fec]/80">
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                {isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#92adc9]">
              Chưa có tài khoản?{' '}
              <button onClick={() => setIsLogin(false)} className="text-[#137fec] font-medium hover:underline">
                Liên hệ admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}