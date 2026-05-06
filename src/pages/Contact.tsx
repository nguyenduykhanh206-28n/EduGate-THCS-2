import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Tư vấn học tập',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const contactPath = 'contacts';
    try {
      await addDoc(collection(db, contactPath), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, contactPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
           <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 serif-title">Liên hệ với chúng tôi</h1>
              <p className="text-slate-500 leading-relaxed max-w-md">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi ý kiến đóng góp của quý phụ huynh và các em học sinh.
              </p>
           </div>

           <div className="space-y-6">
              <div className="flex items-start space-x-4">
                 <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Địa chỉ</h4>
                    <p className="text-sm text-slate-500">Số 123, Đường Láng, Quận Đống Đa, Hà Nội</p>
                 </div>
              </div>
              <div className="flex items-start space-x-4">
                 <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Phone className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Điện thoại</h4>
                    <p className="text-sm text-slate-500">(+84) 24 1234 5678</p>
                 </div>
              </div>
              <div className="flex items-start space-x-4">
                 <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Email</h4>
                    <p className="text-sm text-slate-500">info@edugate.edu.vn</p>
                 </div>
              </div>
           </div>

           <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop" 
                alt="Map Placeholder" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
           </div>
        </div>

        <div className="relative">
           <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 -z-10 opacity-10" />
           <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-50">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-6"
                >
                   <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                   <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Gửi thành công!</h3>
                      <p className="text-slate-500">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                   </div>
                   <button 
                     onClick={() => setSubmitted(false)}
                     className="text-blue-600 font-bold hover:underline"
                   >
                     Gửi tin nhắn khác
                   </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Họ và tên</label>
                      <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Nguyễn Văn A" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Địa chỉ Email</label>
                      <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="email@example.com" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Chủ đề</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium cursor-pointer">
                         <option>Tư vấn học tập</option>
                         <option>Góp ý nhà trường</option>
                         <option>Báo lỗi website</option>
                         <option>Khác</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Lời nhắn của bạn</label>
                      <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none" placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..."></textarea>
                   </div>
                   <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-200 disabled:opacity-50">
                      {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'} <Send className="ml-3 h-5 w-5" />
                   </button>
                </form>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
