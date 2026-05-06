import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search, FileCode, Video } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  category: string;
  date: string;
  fileUrl?: string;
}

const fallbackMaterials = [
  { id: '1', title: 'Đề cương ôn tập Toán 6 học kỳ II', type: 'PDF', size: '2.4 MB', category: 'Toán học', date: '01/05/2026' },
  { id: '2', title: 'Bài tập Ngữ Văn 7: Văn bản nhật dụng', type: 'Word', size: '1.2 MB', category: 'Ngữ văn', date: '30/04/2026' },
  { id: '3', title: 'Tài liệu hướng dẫn thí nghiệm Vật Lý 8', type: 'PDF', size: '5.6 MB', category: 'Vật lý', date: '28/04/2026' },
  { id: '4', title: 'Slide bài giảng Tiếng Anh 9: Unit 10', type: 'PowerPoint', size: '12.0 MB', category: 'Tiếng Anh', date: '25/04/2026' },
  { id: '5', title: 'Bộ câu hỏi trắc nghiệm Tin học 6', type: 'Excel', size: '0.8 MB', category: 'Tin học', date: '20/04/2026' },
];

export default function Materials() {
  const [materialsData, setMaterialsData] = useState<Material[]>(fallbackMaterials);
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const materialsPath = 'materials';
    const q = query(collection(db, materialsPath), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString('vi-VN') : doc.data().date
        })) as Material[];
        setMaterialsData(fetched);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, materialsPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMaterials = materialsData.filter(m => 
    (filter === 'Tất cả' || m.category === filter) &&
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
           <h1 className="text-4xl font-bold serif-title">Thư viện Tài liệu học tập</h1>
           <p className="text-blue-100 max-w-lg">
             Nơi tổng hợp các tài liệu học tập, đề cương, bài giảng từ đội ngũ giáo viên EduGate dành riêng cho các em học sinh.
           </p>
        </div>
        <FileCode className="absolute top-10 right-10 h-64 w-64 text-white/10 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center">
                   <Filter className="h-4 w-4 mr-2" /> Lọc theo môn
                 </h3>
                 <div className="flex flex-col space-y-1">
                    {['Tất cả', 'Toán học', 'Ngữ văn', 'Vật lý', 'Tiếng Anh', 'Tin học'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                          filter === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl">
              <h4 className="font-bold flex items-center text-blue-400">
                <Video className="h-5 w-5 mr-2" /> Học liệu Video
              </h4>
              <p className="text-xs text-slate-400">Xem ngay các bài giảng video sinh động được tích hợp từ kênh Youtube của trường.</p>
              <button className="w-full bg-blue-600 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">Khám phá Video</button>
           </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm tên tài liệu..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="space-y-4 px-4">
              {filteredMaterials.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={m.id}
                  className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center space-x-4">
                     <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                       m.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                     }`}>
                        <FileText className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{m.title}</h4>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">
                           <span>{m.category}</span>
                           <span>•</span>
                           <span>{m.size}</span>
                           <span>•</span>
                           <span>Cập nhật: {m.date}</span>
                        </div>
                     </div>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Download className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
           </div>

           {filteredMaterials.length === 0 && (
             <div className="text-center py-20 text-slate-400 font-medium">Không tìm thấy tài liệu học tập nào.</div>
           )}
        </div>
      </div>
    </div>
  );
}
