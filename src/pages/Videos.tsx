import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Filter } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  videoUrl?: string;
}

const fallbackVideos = [
  { id: '1', title: 'Hướng dẫn giải toán lớp 9: Hệ phương trình bậc nhất', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop', duration: '15:20', views: '1.2k' },
  { id: '2', title: 'Thực hành Lý 8: Sự nổi của vật trong nước', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop', duration: '08:45', views: '950' },
  { id: '3', title: 'English 7 - Unit 5: Vietnamese Food and Drink', thumbnail: 'https://images.unsplash.com/photo-1528605248644-da4d975b21af?q=80&w=2070&auto=format&fit=crop', duration: '12:10', views: '2.5k' },
  { id: '4', title: 'Kỹ năng làm bài văn nghị luận xã hội kì thi vào 10', thumbnail: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2066&auto=format&fit=crop', duration: '20:30', views: '3.1k' },
];

export default function Videos() {
  const [videosData, setVideosData] = useState<VideoItem[]>(fallbackVideos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videosPath = 'videos';
    const q = query(collection(db, videosPath), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as VideoItem[];
        setVideosData(fetched);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, videosPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 serif-title">Thư viện Video bài giảng</h1>
        <p className="text-slate-500">Xem lại các bài giảng trực tuyến và video hướng dẫn học tập sinh động.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videosData.map((v, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={v.id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 shadow-lg">
               <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                     <Play className="h-6 w-6 fill-current" />
                  </div>
               </div>
               <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                 {v.duration}
               </div>
            </div>
            <h3 className="font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{v.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{v.views} lượt xem</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
