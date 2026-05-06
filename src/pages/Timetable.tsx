import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const fallbackSchedule: any = {
  '6A1': [
    { day: 'Thứ 2', subjects: ['Toán', 'Văn', 'Anh', 'Lý', 'Chào cờ'] },
    { day: 'Thứ 3', subjects: ['Sử', 'Địa', 'Toán', 'Anh', 'Sinh'] },
    { day: 'Thứ 4', subjects: ['Văn', 'Văn', 'Nhạc', 'Họa', 'GDCD'] },
    { day: 'Thứ 5', subjects: ['Toán', 'Anh', 'Lý', 'Sử', 'Địa'] },
    { day: 'Thứ 6', subjects: ['Anh', 'Toán', 'Văn', 'SHL', 'Sinh'] },
  ],
  '7A2': [
    { day: 'Thứ 2', subjects: ['Văn', 'Văn', 'Toán', 'Lý', 'Chào cờ'] },
    { day: 'Thứ 3', subjects: ['Toán', 'Anh', 'Sử', 'Địa', 'Sinh'] },
  ]
};

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState('6A1');
  const [scheduleData, setScheduleData] = useState<any>(fallbackSchedule);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timetablePath = `timetables/${selectedClass}`;
    const unsubscribe = onSnapshot(doc(db, 'timetables', selectedClass), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setScheduleData((prev: any) => ({
          ...prev,
          [selectedClass]: data.data || []
        }));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, timetablePath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClass]);

  const currentSchedule = scheduleData[selectedClass] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-800 serif-title">Thời khóa biểu</h1>
          <p className="text-slate-500">Tra cứu lịch học hàng tuần theo từng lớp học.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">Chọn lớp:</span>
           <select 
             value={selectedClass}
             onChange={(e) => setSelectedClass(e.target.value)}
             className="bg-slate-50 border-none rounded-xl text-sm font-bold text-blue-600 px-4 py-2 focus:ring-0 cursor-pointer"
           >
             {Object.keys(scheduleData).map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 border-b border-slate-100">
           {['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5'].map((t, i) => (
             <div key={i} className="p-6 text-center bg-slate-50/50 border-r border-slate-100 last:border-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tiết học</span>
                <span className="text-sm font-bold text-slate-800">{t}</span>
             </div>
           ))}
        </div>

        <div className="divide-y divide-slate-100">
          {currentSchedule.map((row: any) => (
            <div key={row.day} className="grid grid-cols-1 md:grid-cols-5 group">
               {row.subjects.map((sub: string, i: number) => (
                 <div key={i} className="p-8 border-r border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors relative">
                    {i === 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase shadow-sm">
                         {row.day}
                      </div>
                    )}
                    <div className="text-center space-y-2 pt-2">
                       <span className="block text-sm font-bold text-slate-800">{sub}</span>
                       <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-widest">Phòng {100 + i}</span>
                    </div>
                 </div>
               ))}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
         <div className="h-10 w-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0">
            <Clock className="h-5 w-5" />
         </div>
         <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">Lưu ý về giờ giấc</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Các tiết học bắt đầu từ 7:30 sáng. Học sinh cần có mặt tại lớp trước 15 phút để thực hiện nghi thức chào cờ và các hoạt động đầu giờ. Lịch học có thể thay đổi trong trường hợp có sự kiện đặc biệt của nhà trường.
            </p>
         </div>
      </div>
    </div>
  );
}
