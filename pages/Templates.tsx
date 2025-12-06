import React, { useEffect, useState } from 'react';
import { Search, Plus, Copy, Edit3, Trash2, Loader2 } from 'lucide-react';
import { api } from '../api';
import { Template } from '../types';

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Quản lý Mẫu Thông báo</h1>
          <p className="text-[#92adc9]">Tạo sẵn các mẫu tin nhắn để gửi nhanh chóng và nhất quán.</p>
        </div>
        <button className="bg-[#137fec] hover:bg-[#137fec]/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>Tạo Mẫu Mới</span>
        </button>
      </div>

      <div className="bg-[#111a22] border border-[#233648] rounded-xl p-4 md:p-6">
        <div className="mb-6 max-w-md relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]" size={20} />
           <input 
             type="text" 
             placeholder="Tìm kiếm mẫu..." 
             className="w-full h-11 pl-10 pr-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
           />
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-[#137fec]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group bg-[#192633] border border-[#233648] hover:border-[#137fec] rounded-xl p-5 transition-all duration-200">
                 <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-[#233648] rounded-lg text-[#137fec]">
                     <Edit3 size={20} />
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/10 rounded text-[#92adc9] hover:text-white" title="Sao chép">
                        <Copy size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-red-500/20 rounded text-red-400" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                   </div>
                 </div>
                 <h3 className="font-bold text-lg text-white mb-2">{template.name}</h3>
                 <p className="text-sm text-[#92adc9] mb-4 line-clamp-2">{template.content}</p>
                 <div className="text-xs text-[#92adc9] mb-4">Cập nhật: {new Date(template.lastUpdated).toLocaleDateString()}</div>
                 <button className="w-full py-2 rounded-lg bg-[#233648] hover:bg-[#137fec] text-sm font-medium text-white transition-colors">
                   Chỉnh sửa nội dung
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}