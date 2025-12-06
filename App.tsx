import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Bell, FileText, Users, Share2, Send, LogOut, Settings, HelpCircle, Menu, X } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Groups from './pages/Groups';
import Templates from './pages/Templates';
import SendNotification from './pages/SendNotification';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive 
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-[#233648] text-white border-l-2 border-[#137fec]' 
        : 'text-[#92adc9] hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} className={isActive ? 'text-[#137fec]' : ''} />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Bảng điều khiển' },
    { path: '/scheduled', icon: Bell, label: 'Đã lập lịch' },
    { path: '/send', icon: Send, label: 'Gửi thông báo' },
    { path: '/templates', icon: FileText, label: 'Mẫu thông báo' },
    { path: '/groups', icon: Users, label: 'Nhóm nhận' },
    { path: '/channels', icon: Share2, label: 'Kênh gửi' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#101922] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111a22] border-b border-[#233648] flex items-center justify-between px-4 z-50">
        <div className="font-bold text-xl">NotifyHub</div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-300">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#111a22] border-r border-[#233648] flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Quản trị viên</h1>
            <p className="text-xs text-[#92adc9]">admin@company.com</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        <div className="p-4 border-t border-[#233648] space-y-1">
           <SidebarItem to="/settings" icon={Settings} label="Cài đặt" isActive={location.pathname === '/settings'} />
           <SidebarItem to="/help" icon={HelpCircle} label="Trợ giúp" isActive={location.pathname === '/help'} />
           <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-4">
             <LogOut size={20} />
             <span className="text-sm font-medium">Đăng xuất</span>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/scheduled" element={<Layout><Dashboard isScheduledView={true} /></Layout>} />
        <Route path="/channels" element={<Layout><Channels /></Layout>} />
        <Route path="/groups" element={<Layout><Groups /></Layout>} />
        <Route path="/templates" element={<Layout><Templates /></Layout>} />
        <Route path="/send" element={<Layout><SendNotification /></Layout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}