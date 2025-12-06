import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Channel, ChannelType } from '../types';
import { api } from '../api';

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await api.getChannels();
        setChannels(data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Quản lý Kênh Thông báo</h1>
          <p className="text-[#92adc9]">Kết nối và quản lý các kênh gửi tin của bạn.</p>
        </div>
        <button className="bg-[#137fec] hover:bg-[#137fec]/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>Thêm Kênh</span>
        </button>
      </div>

      <div className="bg-[#111a22] border border-[#233648] rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm kênh..." 
                className="w-full h-11 pl-10 pr-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
              />
           </div>
           <select className="h-11 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]">
             <option>Tất cả trạng thái</option>
             <option>Kích hoạt</option>
             <option>Không kích hoạt</option>
           </select>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-[#137fec]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <div key={channel.id} className="bg-[#192633] border border-[#233648] rounded-xl p-5 hover:border-[#137fec]/50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`size-10 rounded-lg flex items-center justify-center text-white font-bold
                    ${channel.type === ChannelType.ZALO ? 'bg-blue-500' : 
                      channel.type === ChannelType.TELEGRAM ? 'bg-sky-400' :
                      channel.type === ChannelType.EMAIL ? 'bg-orange-500' :
                      channel.type === ChannelType.SMS ? 'bg-green-600' : 'bg-purple-500'
                    }
                  `}>
                    {channel.type.charAt(0)}
                  </div>
                  <button className="text-[#92adc9] hover:text-white p-1 rounded hover:bg-white/10">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 truncate" title={channel.name}>{channel.name}</h3>
                <p className="text-sm text-[#92adc9] mb-4">{channel.type}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#233648]">
                  <div className="flex items-center gap-2">
                    {channel.isActive ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                        <CheckCircle size={12} /> Kích hoạt
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-500/10 px-2 py-1 rounded-full">
                        <XCircle size={12} /> Tắt
                      </span>
                    )}
                  </div>
                  <button className="text-sm font-medium text-[#137fec] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                    Cấu hình
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}