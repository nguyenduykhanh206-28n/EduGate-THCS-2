import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Menu, X, Bell, User as UserIcon, BookOpen, GraduationCap, Video, Calendar, Mail, Home as HomeIcon, Info, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Intro = React.lazy(() => import('./pages/Intro'));
const News = React.lazy(() => import('./pages/News'));
const Materials = React.lazy(() => import('./pages/Materials'));
const Videos = React.lazy(() => import('./pages/Videos'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const ChatbotWidget = React.lazy(() => import('./components/ChatbotWidget'));

function Navbar({ user, role }: { user: User | null, role: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: HomeIcon },
    { name: 'Giới thiệu', path: '/intro', icon: Info },
    { name: 'Tin tức', path: '/news', icon: Bell },
    { name: 'Tài liệu', path: '/materials', icon: BookOpen },
    { name: 'Video', path: '/videos', icon: Video },
    { name: 'Thời khóa biểu', path: '/timetable', icon: Calendar },
    { name: 'Liên hệ', path: '/contact', icon: Mail },
  ];

  const isAdminOrTeacher = role === 'admin' || role === 'teacher';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
               <GraduationCap className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">EDU GATE THCS</h1>
              <p className="text-[10px] text-blue-100 opacity-80 uppercase tracking-widest font-medium">Cổng thông tin giáo dục</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAdminOrTeacher && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  location.pathname === '/admin' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-300 hover:bg-amber-600 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Quản trị</span>
              </Link>
            )}

            <div className="h-6 w-px bg-blue-700 mx-2" />
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-900 px-3 py-1.5 rounded-full border border-blue-600">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold leading-none">{user.displayName ? user.displayName.split(' ').pop() : 'User'}</p>
                    {role && <p className="text-[8px] opacity-70 uppercase tracking-tighter font-black mt-0.5">{role}</p>}
                  </div>
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center overflow-hidden border border-blue-400">
                    {user.photoURL ? <img src={user.photoURL} alt="User" /> : <UserIcon className="h-4 w-4 text-slate-600" />}
                  </div>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="p-2 text-blue-300 hover:text-white hover:bg-blue-700 rounded-full transition-all"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-yellow-300 transition-all shadow-sm">
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-blue-900 border-b border-blue-700 py-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-bold">{item.name}</span>
              </Link>
            ))}
            {isAdminOrTeacher && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-6 py-3 text-amber-300 bg-blue-950 font-bold"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-xs">Quản trị hệ thống</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data()?.role || 'student');
          } else {
            setRole('student');
          }
        } catch (err) {
          console.error("Error fetching role:", err);
          setRole('student');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingFallback />;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col pt-16 font-sans">
        <Navbar user={user} role={role} />
        
        <main className="flex-grow bg-slate-50">
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/news" element={<News />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Route */}
              <Route 
                path="/admin" 
                element={
                  (role === 'admin' || role === 'teacher') ? <Admin /> : <Navigate to="/login" />
                } 
              />
              
              <Route path="*" element={<Home />} />
            </Routes>
          </React.Suspense>
        </main>

        <footer className="bg-white border-t border-slate-200 h-10 px-6 flex items-center justify-between shrink-0 text-[10px] text-slate-500 whitespace-nowrap overflow-hidden">
          <div className="flex space-x-4">
            <span className="font-medium">© 2026 Trường THCS EduGate</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Địa chỉ: ấp 2, xã Tam Bình, Vĩnh Long</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Hệ thống trực tuyến</span>
          </div>
        </footer>

        <React.Suspense fallback={null}>
          <ChatbotWidget />
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}
