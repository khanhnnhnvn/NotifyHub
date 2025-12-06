import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Eye, Edit2, XCircle, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { Notification, NotificationStatus } from '../types';
import { Link } from 'react-router-dom';
import { api } from '../api';

const StatusBadge = ({ status }: { status: NotificationStatus }) => {
  const styles = {
    [NotificationStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [NotificationStatus.SENT]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [NotificationStatus.FAILED]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [NotificationStatus.CANCELLED]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]} flex items-center gap-1.5 w-fit`}>
      <span className={`size-1.5 rounded-full bg-current`} />
      {status}
    </span>
  );
};

export default function Dashboard({ isScheduledView = false }: { isScheduledView?: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data if strictly scheduled view
  const data = isScheduledView 
    ? notifications.filter(n => n.status === NotificationStatus.PENDING) 
    : notifications;

  const pageTitle = isScheduledView ? 'Thông báo đã Lập lịch' : 'Tất cả thông báo';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{pageTitle}</h1>
          <p className="text-[#92adc9]">Quản lý và theo dõi trạng thái các thông báo của bạn.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-lg bg-[#233648] text-white hover:bg-[#324d67]">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link 
            to="/send" 
            className="bg-[#137fec] hover:bg-[#137fec]/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Lập lịch Mới</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-[#92adc9]" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..." 
            className="w-full h-11 pl-10 pr-4 bg-[#233648] border-none rounded-lg text-white placeholder-[#92adc9] focus:ring-2 focus:ring-[#137fec]"
          />
        </div>
        <div className="md:col-span-2 relative">
           <select className="w-full h-11 pl-4 pr-10 bg-[#233648] border-none rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-[#137fec]">
             <option>Tất cả Kênh</option>
             <option>Email</option>
             <option>Zalo</option>
             <option>Telegram</option>
           </select>
           <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92adc9] pointer-events-none" size={16} />
        </div>
        <div className="md:col-span-2 relative">
           <select className="w-full h-11 pl-4 pr-10 bg-[#233648] border-none rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-[#137fec]">
             <option>Tất cả Nhóm</option>
             <option>VIP Users</option>
             <option>Marketing</option>
           </select>
           <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92adc9] pointer-events-none" size={16} />
        </div>
        {!isScheduledView && (
           <div className="md:col-span-3 flex items-center gap-2">
             <button className="h-11 px-3 rounded-lg bg-[#137fec]/20 text-[#137fec] text-sm font-medium border border-[#137fec]/30">Tất cả</button>
             <button className="h-11 px-3 rounded-lg bg-[#233648] text-[#92adc9] hover:text-white text-sm font-medium">Đã gửi</button>
             <button className="h-11 px-3 rounded-lg bg-[#233648] text-[#92adc9] hover:text-white text-sm font-medium">Lỗi</button>
           </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#111a22] border border-[#233648] rounded-xl overflow-hidden shadow-sm min-h-[300px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111a22]/80 z-10">
            <Loader2 className="animate-spin text-[#137fec]" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#192633] border-b border-[#233648]">
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider">Thời gian</th>
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider w-1/3">Tiêu đề / Nội dung</th>
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider">Kênh</th>
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider">Nhóm nhận</th>
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider">Trạng thái</th>
                  <th className="p-4 text-xs font-bold text-[#92adc9] uppercase tracking-wider text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233648]">
                {data.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-[#92adc9]">Chưa có dữ liệu thông báo</td>
                   </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-[#233648]/30 transition-colors">
                      <td className="p-4 text-sm whitespace-nowrap text-gray-300">
                        {new Date(item.scheduledTime).toLocaleString('vi-VN', { 
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs md:max-w-md">
                          <p className="font-semibold text-white mb-0.5">{item.title}</p>
                          <p className="text-sm text-[#92adc9] truncate">{item.content}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-300">{item.channel}</td>
                      <td className="p-4 text-sm text-gray-300">{item.group}</td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/10 text-[#92adc9] hover:text-white transition-colors">
                            <Eye size={18} />
                          </button>
                          {item.status === NotificationStatus.PENDING && (
                            <>
                              <button className="p-2 rounded-lg hover:bg-white/10 text-[#92adc9] hover:text-white transition-colors">
                                <Edit2 size={18} />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="p-4 border-t border-[#233648] flex items-center justify-between">
            <span className="text-sm text-[#92adc9]">Hiển thị {data.length} kết quả</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-[#233648] text-[#92adc9] disabled:opacity-50 hover:text-white" disabled>
                <ChevronLeft size={18} />
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-[#137fec] text-white text-sm font-bold">1</button>
              <button className="p-2 rounded-lg bg-[#233648] text-[#92adc9] hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}