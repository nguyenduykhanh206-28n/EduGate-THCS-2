import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Tag, User } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  image: string;
  content: string;
}

const fallbackNews = [
  { id: '1', title: 'Lễ ra quân Đội tuyển học sinh giỏi tham dự Kỳ thi cấp Thành phố', date: '01/05/2026', category: 'Hoạt động', author: 'Ban Giám Hiệu', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop', content: '' },
  { id: '2', title: 'Thông báo tuyển sinh lớp 6 năm học 2026-2027: Chỉ tiêu và phương thức xét tuyển', date: '30/04/2026', category: 'Tuyển sinh', author: 'VP Tuyển sinh', image: 'https://images.unsplash.com/photo-1491841202422-772986f32e6b?q=80&w=2070&auto=format&fit=crop', content: '' },
  { id: '3', title: 'Chương trình ngoại khóa "Hành trình di sản" tại Văn Miếu Quốc Tử Giám', date: '25/04/2026', category: 'Hoạt động', author: 'Đội TNTP', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop', content: '' },
  { id: '4', title: 'Kỷ niệm 15 năm thành lập Trường THCS EduGate: Những bước chân tự hào', date: '20/04/2026', category: 'Sự kiện', author: 'Truyền thông', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2074&auto=format&fit=crop', content: '' },
];

export default function News() {
  const [newsData, setNewsData] = useState<NewsItem[]>(fallbackNews);
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsPath = 'news';
    const q = query(collection(db, newsPath), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedNews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Format date if it's a timestamp
          date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString('vi-VN') : doc.data().date
        })) as NewsItem[];
        setNewsData(fetchedNews);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, newsPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredNews = newsData.filter(n => 
    (filter === 'Tất cả' || n.category === filter) &&
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 serif-title">Tin tức & Thông báo</h1>
        <p className="text-slate-500">Cập nhật những thông tin mới nhất về hoạt động và thông báo từ nhà trường.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['Tất cả', 'Thông báo', 'Hoạt động', 'Sự kiện', 'Tuyển sinh'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((news) => (
          <motion.div
            layout
            key={news.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
               <img 
                 src={news.image} 
                 alt={news.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-4 left-4">
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {news.category}
                  </span>
               </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {news.date}</span>
                <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {news.author}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                {news.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                Nội dung tóm tắt của bài viết tin tức tại đây. Mục tiêu là cung cấp thông tin ngắn gọn nhất để người dùng nắm bắt được vấn đề học đường đang diễn ra...
              </p>
              <button className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                Xem chi tiết <Search className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      )}
    </div>
  );
}
