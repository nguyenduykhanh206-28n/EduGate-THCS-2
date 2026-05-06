import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Users, Award, Bell, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-4 h-[calc(100vh-6.5rem)] overflow-hidden">
      
      {/* Left Column: Notifications & Schedule */}
      <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4 h-full">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-red-700 uppercase tracking-widest">Thông báo khẩn</h3>
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {[
              { date: '10/05', title: 'Lịch thi học kỳ II năm học 2025-2026', color: 'border-red-400' },
              { date: '08/05', title: 'Nghỉ lễ kỷ niệm ngày Giải phóng miền Nam', color: 'border-blue-400' },
              { date: '05/05', title: 'Danh sách đội tuyển HSG cấp Thành phố', color: 'border-emerald-400' },
            ].map((n, i) => (
              <div key={i} className={`border-l-4 ${n.color} pl-3 py-1`}>
                <p className="text-[10px] text-slate-400 font-bold">{n.date}</p>
                <p className="text-xs font-bold text-slate-800 leading-snug hover:text-blue-600 cursor-pointer">{n.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Lịch hôm nay</h3>
            <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Thứ Hai</span>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto">
            {[
              { time: 'T1-2', subject: 'Toán học (6A1)', room: 'P.201', active: true },
              { time: 'T3', subject: 'Ngữ văn (7A2)', room: 'P.304', active: false },
              { time: 'T4-5', subject: 'Tiếng Anh (8B1)', room: 'P.105', active: false },
            ].map((s, i) => (
              <div key={i} className={`flex items-center p-2 rounded ${s.active ? 'bg-blue-50/50' : ''}`}>
                <span className={`w-10 font-mono text-[10px] font-bold ${s.active ? 'text-blue-600' : 'text-slate-400'}`}>{s.time}</span>
                <span className="flex-1 text-xs font-bold text-slate-700 truncate">{s.subject}</span>
                <span className="text-[10px] text-slate-400 font-medium">{s.room}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Middle Column: Hero & Content */}
      <div className="col-span-12 lg:col-span-6 flex flex-col space-y-4">
        {/* Compact Hero */}
        <div className="relative h-64 rounded-2x overflow-hidden bg-blue-900 shadow-lg shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/60 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
            <span className="bg-yellow-400 text-blue-900 text-[10px] font-black px-2 py-1 rounded w-fit mb-3 uppercase tracking-tighter">Sự kiện tiêu biểu</span>
            <h2 className="text-3xl font-black text-white leading-[0.9] mb-3 tracking-tighter">KỶ NIỆM 15 NĂM <br />THÀNH LẬP EDUGATE</h2>
            <p className="text-blue-100 text-xs max-w-sm font-medium leading-relaxed">Chuỗi hoạt động văn hóa, thể thao chào mừng ngày thành lập trường THCS EduGate tại sân trường.</p>
          </div>
        </div>

        {/* Content Feed */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col overflow-hidden">
          <div className="flex items-center space-x-6 border-b border-slate-100 mb-4 shrink-0">
            <button className="pb-3 text-xs font-black text-blue-700 border-b-2 border-blue-700 uppercase tracking-widest">Hoạt động giáo dục</button>
            <button className="pb-3 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Góc học sinh</button>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {[
              { title: 'Khai mạc hội khỏe Phù Đổng lần thứ X', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400', desc: 'Hơn 500 vận động viên tham gia tranh tài ở 8 bộ môn...' },
              { title: 'Tham quan Bảo tàng Dân tộc học', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400', desc: 'Hành trình tìm hiểu bản sắc văn hóa các dân tộc Việt Nam...' },
              { title: 'Cuộc thi Sáng tạo Robot 2026', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400', desc: 'Khám phá tiềm năng công nghệ của học sinh khối 8, 9...' },
              { title: 'Ngày hội đọc sách EDU GATE', img: 'https://images.unsplash.com/photo-1491841202422-772986f32e6b?q=80&w=400', desc: 'Lan tỏa niềm đam mê đọc sách trong cộng đồng học đường...' },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="h-32 bg-slate-100 rounded-xl mb-3 overflow-hidden border border-slate-100 shadow-inner">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h4 className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Materials & Links */}
      <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 shrink-0">
          <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
            Tài liệu mới nhất
          </h3>
          <div className="space-y-3">
            {[
              { type: 'PDF', title: 'Đề ôn tập Toán 9 - HK2', size: '1.2MB', icon: 'bg-red-50 text-red-600' },
              { type: 'DOC', title: 'Mẫu kế hoạch bài dạy 2026', size: '45KB', icon: 'bg-blue-50 text-blue-600' },
              { type: 'VID', title: 'Video TN Hóa học 8', size: '15:30', icon: 'bg-emerald-50 text-emerald-600' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center p-2.5 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 cursor-pointer transition-all">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black ${doc.icon}`}>
                  {doc.type}
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{doc.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{doc.size}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-[10px] font-black text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 uppercase tracking-widest transition-all">
            Xem tất cả kho báu số
          </button>
        </section>

        {/* AI Mini Widget */}
        <section className="bg-ai-900 rounded-xl shadow-lg border border-indigo-700 flex-1 flex flex-col text-white overflow-hidden">
          <div className="p-3 flex items-center space-x-2 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Trợ lý AI EduGate</span>
          </div>
          <div className="flex-1 p-4 flex flex-col space-y-4">
            <div className="bg-indigo-800/40 p-3 rounded-xl text-[11px] border border-white/5 leading-relaxed font-medium">
              Chào bạn! Tôi có thể giúp gì cho học tập hôm nay?
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600/60 p-3 rounded-xl text-[11px] max-w-[85%] border border-white/5 font-medium">
                Tìm cho tôi thời khóa biểu lớp 6A1
              </div>
            </div>
          </div>
          <div className="p-3 mt-auto">
            <div className="relative">
              <input type="text" placeholder="Hỏi AI..." className="w-full bg-indigo-800/80 border-none rounded-full py-2 px-4 text-[11px] placeholder-white/30 focus:ring-1 focus:ring-blue-400 outline-none font-medium" />
              <button className="absolute right-2 top-1.5 text-blue-400 hover:text-white transition-colors">
                 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
