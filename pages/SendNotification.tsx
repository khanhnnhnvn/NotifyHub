import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, Save, Wand2, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ChannelType, NotificationStatus, Group, Template } from '../types';

export default function SendNotification() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<ChannelType>(ChannelType.EMAIL);
  const [group, setGroup] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gData, tData] = await Promise.all([api.getGroups(), api.getTemplates()]);
        setGroups(gData);
        setTemplates(tData);
        if (gData.length > 0) setGroup(gData[0].name);
      } catch (err) {
        console.error("Failed to load form data");
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const selected = templates.find(t => t.id.toString() === templateId);
    if (selected) {
       setContent(selected.content);
       setTitle(selected.name); // Optional: auto-fill title
    } else {
       setContent("");
       setTitle("");
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      let scheduledTime = new Date().toISOString();
      if (isScheduled && scheduleDate && scheduleTime) {
         scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      }

      await api.createNotification({
        title,
        content,
        channel,
        group,
        scheduledTime,
        status: isScheduled ? NotificationStatus.PENDING : NotificationStatus.SENT
      });

      // Redirect to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      console.error("Error creating notification", err);
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Gửi Thông báo</h1>
        <p className="text-[#92adc9]">Soạn thảo và gửi thông báo đến các nhóm người dùng.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recipient Config */}
          <div className="bg-[#111a22] rounded-xl p-6 border border-[#233648]">
            <h2 className="text-xl font-bold text-white mb-6">Cấu hình người nhận</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Kênh gửi</label>
                <select 
                  value={channel} 
                  onChange={(e) => setChannel(e.target.value as ChannelType)}
                  className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
                >
                  <option value={ChannelType.EMAIL}>Email</option>
                  <option value={ChannelType.SMS}>SMS</option>
                  <option value={ChannelType.ZALO}>Zalo</option>
                  <option value={ChannelType.PUSH}>Mobile Push</option>
                  <option value={ChannelType.TELEGRAM}>Telegram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Nhóm nhận</label>
                {loadingData ? (
                   <div className="h-12 w-full bg-[#192633] rounded-lg animate-pulse" />
                ) : (
                  <select 
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Content Config */}
          <div className="bg-[#111a22] rounded-xl p-6 border border-[#233648]">
            <h2 className="text-xl font-bold text-white mb-6">Nội dung thông báo</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Mẫu thông báo (Tùy chọn)</label>
                <select onChange={handleTemplateChange} className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]">
                  <option value="">-- Chọn mẫu --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#92adc9] mb-2">Tiêu đề</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..." 
                  className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-[#92adc9]">Nội dung chi tiết</label>
                  <button className="text-xs text-[#137fec] flex items-center gap-1 hover:underline">
                    <Wand2 size={12} /> AI Gợi ý nội dung
                  </button>
                </div>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Soạn nội dung của bạn tại đây..." 
                  className="w-full min-h-[160px] p-4 bg-[#192633] border border-[#233648] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] resize-y"
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-[#111a22] rounded-xl p-6 border border-[#233648]">
            <h2 className="text-xl font-bold text-white mb-6">Thời gian gửi</h2>
            
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="schedule" 
                  checked={!isScheduled}
                  onChange={() => setIsScheduled(false)}
                  className="w-5 h-5 text-[#137fec] bg-transparent border-gray-500 focus:ring-[#137fec]" 
                />
                <span>Gửi ngay lập tức</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="schedule" 
                  checked={isScheduled}
                  onChange={() => setIsScheduled(true)}
                  className="w-5 h-5 text-[#137fec] bg-transparent border-gray-500 focus:ring-[#137fec]" 
                />
                <span>Lên lịch gửi</span>
              </label>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-medium text-[#92adc9] mb-2">Ngày gửi</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:ring-2 focus:ring-[#137fec] [color-scheme:dark]" 
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#92adc9] mb-2">Giờ gửi</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full h-12 px-4 bg-[#192633] border border-[#233648] rounded-lg text-white focus:ring-2 focus:ring-[#137fec] [color-scheme:dark]" 
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button className="px-6 py-3 rounded-lg font-bold text-white bg-[#233648] hover:bg-[#324d67] transition-colors flex items-center gap-2">
              <Save size={20} /> Lưu nháp
            </button>
            <button 
              onClick={handleSend}
              disabled={sending || (isScheduled && (!scheduleDate || !scheduleTime))}
              className={`px-6 py-3 rounded-lg font-bold text-white bg-[#137fec] hover:bg-[#137fec]/90 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {sending ? 'Đang xử lý...' : (isScheduled ? 'Lên lịch' : 'Gửi ngay')}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
           <div className="sticky top-6">
             <div className="bg-[#111a22] rounded-xl p-6 border border-[#233648]">
               <h2 className="text-lg font-bold text-white mb-4">Xem trước ({channel})</h2>
               
               {/* Mobile Preview Frame */}
               <div className="mx-auto border-4 border-[#233648] rounded-[2rem] overflow-hidden bg-[#101922] max-w-[300px] h-[500px] relative">
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#233648] rounded-b-xl z-10" />
                 
                 {/* Content Inside Phone */}
                 <div className="h-full w-full bg-[#f0f2f5] dark:bg-[#000] text-black dark:text-white pt-12 px-3 overflow-y-auto">
                   
                   {/* Notification Item */}
                   <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-3 shadow-sm border border-white/5">
                     <div className="flex gap-3">
                       <div className="size-10 bg-[#137fec] rounded-lg flex items-center justify-center shrink-0">
                         <span className="font-bold text-white text-xs">APP</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-sm">NotifyHub</h4>
                           <span className="text-[10px] text-gray-400">Vừa xong</span>
                         </div>
                         <p className="text-sm mt-1 font-medium break-words">
                           {content || "Nội dung thông báo sẽ hiển thị tại đây..."}
                         </p>
                       </div>
                     </div>
                   </div>

                 </div>
               </div>

               <p className="text-center text-xs text-[#92adc9] mt-4">
                 * Hình ảnh chỉ mang tính chất minh họa. Hiển thị thực tế có thể khác tùy thuộc vào thiết bị người dùng.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}