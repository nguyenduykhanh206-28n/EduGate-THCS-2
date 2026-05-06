import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Bell, BookOpen, Video, Calendar, Plus, 
  Trash2, Save, CheckCircle, AlertCircle, Loader2, Image as ImageIcon,
  FileText, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, addDoc, serverTimestamp, getDocs, query, orderBy, 
  deleteDoc, doc 
} from 'firebase/firestore';

type AdminTab = 'news' | 'materials' | 'videos' | 'timetable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('news');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Data states
  const [news, setNews] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  // Form states
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'notification', image: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', category: 'Toán học', fileUrl: '', type: 'PDF', size: '1.0 MB' });
  const [videoForm, setVideoForm] = useState({ title: '', youtubeId: '', duration: '', views: '0' });

  const resetStatus = () => setTimeout(() => setStatus(null), 3000);

  const fetchData = async () => {
    try {
      const newsSnap = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')));
      setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const matsSnap = await getDocs(query(collection(db, 'materials'), orderBy('createdAt', 'desc')));
      setMaterials(matsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const vidsSnap = await getDocs(query(collection(db, 'videos'), orderBy('createdAt', 'desc')));
      setVideos(vidsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (coll: string, id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
    try {
      await deleteDoc(doc(db, coll, id));
      setStatus({ type: 'success', message: 'Đã xóa thành công!' });
      fetchData();
      resetStatus();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, coll);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'news'), {
        ...newsForm,
        authorId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setStatus({ type: 'success', message: 'Đã đăng tin tức thành công!' });
      setNewsForm({ title: '', content: '', category: 'notification', image: '' });
      fetchData();
      resetStatus();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'news');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'materials'), {
        ...materialForm,
        teacherId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setStatus({ type: 'success', message: 'Đã tải lên tài liệu thành công!' });
      setMaterialForm({ title: '', category: 'Toán học', fileUrl: '', type: 'PDF', size: '1.0 MB' });
      fetchData();
      resetStatus();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'materials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'videos'), {
        ...videoForm,
        teacherId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setStatus({ type: 'success', message: 'Đã thêm video bài giảng!' });
      setVideoForm({ title: '', youtubeId: '', duration: '', views: '0' });
      fetchData();
      resetStatus();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <LayoutDashboard className="h-3 w-3" />
            <span>Trung tâm điều hành</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-slate-500 font-medium">Quản lý nội dung học tập và thông báo của nhà trường.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {(['news', 'materials', 'videos', 'timetable'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-tight whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'news' ? 'Tin tức' : tab === 'materials' ? 'Tài liệu' : tab === 'videos' ? 'Video' : 'Lịch học'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Form Column */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 h-fit space-y-6">
            <div className="flex items-center space-x-3 text-blue-600">
               <Plus className="h-5 w-5" />
               <h2 className="text-lg font-black tracking-tight">Thêm mới nội dung</h2>
            </div>

            {status && (
              <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <span className="text-xs font-bold">{status.message}</span>
              </div>
            )}

            {activeTab === 'news' && (
              <form onSubmit={handleCreateNews} className="space-y-4">
                <input required value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Tiêu đề tin tức" />
                <select value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium">
                  <option value="notification">Thông báo</option>
                  <option value="activity">Hoạt động</option>
                  <option value="event">Sự kiện</option>
                </select>
                <input value={newsForm.image} onChange={e => setNewsForm({...newsForm, image: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Link ảnh minh họa" />
                <textarea required value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium resize-none" placeholder="Nội dung bài viết..."></textarea>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-blue-100">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Đăng tin</span>
                </button>
              </form>
            )}

            {activeTab === 'materials' && (
              <form onSubmit={handleCreateMaterial} className="space-y-4">
                <input required value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Tên tài liệu" />
                <select value={materialForm.category} onChange={e => setMaterialForm({...materialForm, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium">
                  <option>Toán học</option>
                  <option>Ngữ văn</option>
                  <option>Vật lý</option>
                  <option>Tiếng Anh</option>
                  <option>Tin học</option>
                </select>
                <input required value={materialForm.fileUrl} onChange={e => setMaterialForm({...materialForm, fileUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Link tải file (Google Drive...)" />
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-green-100">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Lưu tài liệu</span>
                </button>
              </form>
            )}

            {activeTab === 'videos' && (
              <form onSubmit={handleCreateVideo} className="space-y-4">
                <input required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Tiêu đề bài giảng video" />
                <input required value={videoForm.youtubeId} onChange={e => setVideoForm({...videoForm, youtubeId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium font-mono" placeholder="YouTube Video ID" />
                <input value={videoForm.duration} onChange={e => setVideoForm({...videoForm, duration: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" placeholder="Thời lượng (vd: 12:45)" />
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-indigo-100">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  <span>Thêm video</span>
                </button>
              </form>
            )}

            {activeTab === 'timetable' && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                 <p className="text-amber-800 text-[10px] font-bold leading-relaxed">Tính năng cập nhật thời khóa biểu qua JSON sẽ khả dụng trong phiên bản tới.</p>
              </div>
            )}
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách hiện tại</h3>
               <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md">
                 {activeTab === 'news' ? news.length : activeTab === 'materials' ? materials.length : videos.length} mục
               </span>
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-[600px] p-6 space-y-4">
               {activeTab === 'news' && news.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all">
                    <div className="flex items-center space-x-4 overflow-hidden">
                       <div className="w-12 h-12 rounded-lg bg-blue-100 flex-shrink-0 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-blue-600" />
                       </div>
                       <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{item.category}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDelete('news', item.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               ))}

               {activeTab === 'materials' && materials.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-lg bg-green-100 flex-shrink-0 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{item.category} • {item.type}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                          <ExternalLink className="h-4 w-4" />
                       </a>
                       <button onClick={() => handleDelete('materials', item.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                 </div>
               ))}

               {activeTab === 'videos' && videos.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-lg bg-indigo-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={`https://img.youtube.com/vi/${item.youtubeId}/default.jpg`} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">YouTube ID: {item.youtubeId}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDelete('videos', item.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               ))}

               {(activeTab === 'news' && news.length === 0) || (activeTab === 'materials' && materials.length === 0) || (activeTab === 'videos' && videos.length === 0) ? (
                 <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400">Chưa có nội dung nào được đăng.</p>
                 </div>
               ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
