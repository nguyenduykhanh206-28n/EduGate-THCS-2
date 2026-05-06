import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Users, Trophy } from 'lucide-react';

const values = [
  { title: 'Chất lượng', desc: 'Luôn hướng tới tiêu chuẩn giáo dục cao nhất.', icon: Target },
  { title: 'Sáng tạo', desc: 'Khuyến khích học sinh tư duy khác biệt.', icon: Eye },
  { title: 'Nhân ái', desc: 'Xây dựng môi trường giáo dục đầy tình thương.', icon: Heart },
  { title: 'Trách nhiệm', desc: 'Có trách nhiệm với cộng đồng và xã hội.', icon: Shield },
];

const StaffCard = ({ name, role, image }: { name: string, role: string, image: string }) => (
  <div className="text-center group">
    <div className="relative mb-4 inline-block">
      <div className="w-48 h-48 overflow-hidden rounded-full border-4 border-white shadow-xl">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute -bottom-2 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg">
        <Award className="h-4 w-4" />
      </div>
    </div>
    <h3 className="text-lg font-bold text-slate-800">{name}</h3>
    <p className="text-sm text-slate-500 font-medium">{role}</p>
  </div>
);

import { Award } from 'lucide-react';

export default function Intro() {
  return (
    <div className="pb-20 space-y-20">
      {/* Header */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop" alt="Edu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-bold text-white serif-title"
           >
             Giới thiệu về EduGate
           </motion.h1>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
             EduGate THCS không chỉ là một ngôi trường, đó là một gia đình nơi các em học sinh được lớn lên và tỏa sáng.
           </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
           <div className="space-y-4">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Sứ mệnh của chúng tôi</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 serif-title">Khơi nguồn sáng tạo <br /> Chắp cánh ước mơ</h2>
              <p className="text-slate-600 leading-relaxed">
                Được thành lập từ năm 2010, Trường THCS EduGate đã trải qua hơn 15 năm hình thành và phát triển. Chúng tôi tự hào là đơn vị tiên phong trong việc đổi mới phương pháp giảng dạy, kết hợp giữa chương trình chuẩn của Bộ Giáo dục & Đào tạo với các kỹ năng mềm quốc tế.
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <Users className="h-8 w-8 text-blue-600 mb-4" />
                 <h4 className="font-bold text-slate-800">1200+ Học sinh</h4>
                 <p className="text-xs text-slate-500">Đang theo học tại trường</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <Trophy className="h-8 w-8 text-amber-600 mb-4" />
                 <h4 className="font-bold text-slate-800">50+ Giải quốc gia</h4>
                 <p className="text-xs text-slate-500">Trong 5 năm gần nhất</p>
              </div>
           </div>
        </div>
        <div className="relative">
           <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop" alt="School Activity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
           </div>
           <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600 rounded-3xl -z-10" />
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 serif-title inline-block border-b-4 border-blue-600 pb-2">Giá trị cốt lõi</h2>
         </div>
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 text-center space-y-4 rounded-3xl hover:bg-slate-50 transition-colors"
              >
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Staff */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <div className="text-center mb-16 space-y-4">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Đội ngũ lãnh đạo</span>
            <h2 className="text-4xl font-bold text-slate-900 serif-title">Ban Giám Hiệu Nhà Trường</h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <StaffCard name="Thầy Nguyễn Văn A" role="Hiệu trưởng" image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" />
            <StaffCard name="Cô Trần Thị B" role="Phó Hiệu trưởng" image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" />
            <StaffCard name="Thầy Lê Văn C" role="Trưởng phòng Đào tạo" image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" />
         </div>
      </section>
    </div>
  );
}
