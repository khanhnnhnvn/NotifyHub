import React, { useEffect, useState } from 'react';
import { Search, Plus, UserPlus, Trash2, Edit, Loader2 } from 'lucide-react';
import { api } from '../api';
import { Group } from '../types';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.getGroups();
        setGroups(data);
        if (data.length > 0) setSelectedGroup(data[0]);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* List Panel */}
      <div className="w-full lg:w-1/3 bg-[#111a22] border border-[#233648] rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#233648] space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold">Nhóm nhận tin</h2>
             <span className="bg-[#233648] text-xs px-2 py-1 rounded-full text-[#92adc9]">{groups.length} nhóm</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92adc9]" size={18} />
            <input 
              className="w-full bg-[#192633] border-none rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-[#137fec]"
              placeholder="Tìm nhóm..."
            />
          </div>
          <button className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
            <Plus size={18} /> Tạo nhóm mới
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#92adc9]" /></div>
          ) : (
            groups.map((group) => (
              <div 
                key={group.id} 
                onClick={() => setSelectedGroup(group)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedGroup?.id === group.id ? 'bg-[#137fec]/10 border border-[#137fec]/30' : 'hover:bg-[#192633]'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-sm ${selectedGroup?.id === group.id ? 'text-[#137fec]' : 'text-white'}`}>{group.name}</h3>
                  <span className="text-xs text-[#92adc9]">{group.memberCount} tv</span>
                </div>
                <p className="text-xs text-[#92adc9] mt-1 line-clamp-1">{group.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 bg-[#111a22] border border-[#233648] rounded-xl flex flex-col overflow-hidden">
        {selectedGroup ? (
          <>
            <div className="p-6 border-b border-[#233648] flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-white">{selectedGroup.name}</h1>
                <p className="text-[#92adc9] text-sm mt-1">{selectedGroup.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-[#92adc9] hover:text-white hover:bg-white/10 rounded-lg">
                  <Edit size={20} />
                </button>
                <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Danh sách thành viên ({selectedGroup.memberCount})</h3>
                <button className="flex items-center gap-2 text-sm font-medium text-[#137fec] hover:bg-[#137fec]/10 px-3 py-1.5 rounded-lg transition-colors">
                  <UserPlus size={16} /> Thêm thành viên
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#233648]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#192633] text-[#92adc9]">
                    <tr>
                      <th className="p-3 font-medium">Tên</th>
                      <th className="p-3 font-medium">Email / SĐT</th>
                      <th className="p-3 font-medium text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#233648]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-[#192633]/50">
                        <td className="p-3 text-white font-medium">Thành viên {i}</td>
                        <td className="p-3 text-[#92adc9]">member{i}@example.com</td>
                        <td className="p-3 text-right">
                          <button className="text-red-400 hover:underline">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
           <div className="flex items-center justify-center h-full text-[#92adc9]">Vui lòng chọn một nhóm</div>
        )}
      </div>
    </div>
  );
}