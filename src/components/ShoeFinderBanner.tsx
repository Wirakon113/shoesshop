import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShoeFinderBanner: React.FC = () => {
  const { setIsQuizOpen } = useStore();

  return (
    <section className="bg-black text-white py-12 sm:py-16 border-b border-neutral-800 relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
        <span className="text-[120px] sm:text-[180px] font-black uppercase font-display leading-none">
          QUIZ
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#111111] border border-neutral-800 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 bg-white text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>SHOE FINDER QUIZ • ใช้เวลาเพียง 1 นาที</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight font-display text-white">
              ยังไม่แน่ใจว่ารุ่นไหนเหมาะกับคุณที่สุด?
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              ลองทำแบบสอบถามค้นหารองเท้าสั้นๆ 5 ข้อ ระบบจะวิเคราะห์กิจกรรม สไตล์เท้า และฟังก์ชันที่คุณต้องการ พร้อมคัดสรรรองเท้าที่ตรงใจคุณมากที่สุดแบบแม่นยำ
            </p>

            {/* Micro Benefits */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ตรงจุดตามกิจกรรม</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>เช็กไซส์พร้อมส่งทันที</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>คุมงบประมาณได้เป๊ะ</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              id="shoe-finder-banner-open-modal-btn"
              onClick={() => setIsQuizOpen(true)}
              className="bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2.5 shadow-lg group"
            >
              <span>เริ่มทำแบบสอบถาม</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <Link
              to="/quiz"
              className="px-6 py-4 border border-neutral-700 text-neutral-300 hover:text-white hover:border-white text-xs font-bold uppercase tracking-widest transition-colors text-center"
            >
              เปิดหน้าเต็ม
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
