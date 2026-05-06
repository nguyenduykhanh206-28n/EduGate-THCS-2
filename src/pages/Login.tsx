import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { signInWithGoogle, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user document exists, if not create it
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.email === 'duykhanh.nguyen7@gmail.com' ? 'admin' : 'student',
          createdAt: serverTimestamp()
        });
      } else if (user.email === 'duykhanh.nguyen7@gmail.com' && userSnap.data()?.role !== 'admin') {
        // Tự động nâng cấp lên admin nếu là email của bạn
        await setDoc(userRef, { role: 'admin' }, { merge: true });
      }
      
      navigate('/');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Chào mừng trở lại</h2>
            <p className="text-slate-500 text-sm font-medium">Hệ thống giáo dục thông minh EduGate</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 py-4 rounded-2xl hover:bg-slate-50 transition-all group disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-slate-700 font-bold text-sm">Tiếp tục với Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Dành cho cán bộ</span></div>
        </div>

        <p className="text-center text-[10px] text-slate-400 leading-relaxed font-medium">
          Việc đăng nhập giúp bạn truy cập vào các tài liệu nội bộ, quản lý tin tức và thời khóa biểu của nhà trường.
        </p>
      </motion.div>
    </div>
  );
}
