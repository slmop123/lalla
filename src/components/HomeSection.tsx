import React, { useState, useEffect } from "react";
import { NewsItem, TeacherItem } from "../types";
import { 
  Users, 
  CalendarDays, 
  BookHeart, 
  UserSquare2, 
  CheckCircle2, 
  Bookmark, 
  RefreshCw,
  GraduationCap
} from "lucide-react";
import { motion } from "motion/react";
import { getNewsLocal, getTeachersLocal } from "../lib/schoolData";

interface HomeSectionProps {
  onGoToChat: () => void;
}

export default function HomeSection({ onGoToChat }: HomeSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [errorNews, setErrorNews] = useState<string>("");

  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);

  const loadAllHomeData = () => {
    setIsLoadingNews(true);
    setIsLoadingTeachers(true);
    setErrorNews("");
    try {
      // Server reversed the news array so latest is on top
      const localNews = getNewsLocal();
      setNews(localNews.slice().reverse());
      
      const localTeachers = getTeachersLocal();
      setTeachers(localTeachers);
    } catch (err) {
      console.error("Error loading home page data:", err);
      setErrorNews("خطأ في تحميل ملفات وجداول البيانات بالمؤسسة.");
    } finally {
      setIsLoadingNews(false);
      setIsLoadingTeachers(false);
    }
  };

  useEffect(() => {
    loadAllHomeData();

    window.addEventListener("school-data-updated", loadAllHomeData);
    return () => window.removeEventListener("school-data-updated", loadAllHomeData);
  }, []);

  const adminStaff = [
    { name: "السيد بوجمعة", role: "المدير التربوي للمؤسسة", desc: "الإشراف والتدبير الإداري العام والسهر على توفير المناخ التعليمي الملائم للتحصيل الدراسي والتفوق.", id: "director-bojamaa" },
    { name: "السيد العجيلي", role: "الحارس العام للخارجية", desc: "التتبع اليومي للمتعملين، مراقبة الانضباط والمواظبة، وتيسير قنوات التواصل الدائمة مع الآباء وأولياء الأمور.", id: "guard-ajili" }
  ];

  return (
    <div className="space-y-12">
      
      {/* 1. Hero / Welcome banner */}
      <section className="bg-white rounded-2xl border border-amber-200/50 p-6 sm:p-10 shadow-sm relative overflow-hidden" id="welcome-hero-section">
        {/* Decorative corner Zellij motifs */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-moroccan-gold/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-royal-blue/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-royal-blue border border-blue-100">
            <CheckCircle2 className="h-3.5 w-3.5 text-royal-blue" />
            <span>فضاء تربوي متميز بعين السبع للتميز والنجاح</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-royal-blue leading-tight">
            مرحباً بكم في الثانوية الإعدادية <br/>
            <span className="text-moroccan-gold font-bold relative inline-block mt-1">
              للا أسماء
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            منبر تربوي رائد وبوابة رقمية تفاعلية حديثة، غايتها توفير المواكبة العلمية للمتعلمين وتيسير سبل التحضير للاستحقاقات الإشهادية بفضل طاقم إداري وتربوي كفؤ ودعم بالذكاء الاصطناعي الأكاديمي المتخصص.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-go-to-chat-btn"
              onClick={onGoToChat}
              className="w-full sm:w-auto px-6 py-3 bg-royal-blue text-white hover:bg-royal-hover rounded-xl shadow-md hover:shadow-lg font-bold text-sm tracking-wide transition duration-200 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <GraduationCap className="h-5 w-5 text-moroccan-gold group-hover:rotate-12 transition-transform" />
              <span>ابدأ مراجعة دروسك مع الذكاء الاصطناعي "شاهين 01"</span>
            </button>
            <a
              id="hero-scroll-news-link"
              href="#school-news-title"
              className="w-full sm:w-auto px-6 py-3 bg-soft-beige hover:bg-neutral-100 text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm transition duration-200 text-center"
            >
              <span>تصفح آخر الأخبار والمستجدات</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Quick Highlight Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-grid-section">
        <div className="bg-white p-5 rounded-xl border border-amber-200/40 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-moroccan-gold">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-bold">الموسم الدراسي الحالي</h4>
            <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">2025 / 2026</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/40 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-royal-blue">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-bold">المستوى التربوي المستهدف</h4>
            <p className="text-base font-bold text-slate-800 mt-0.5">السلك الثانوي الإعدادي</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/40 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-traditional-clay">
            <BookHeart className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 font-bold">بوابة الدعم المباشر ومخرجات PDF</h4>
            <p className="text-base font-bold text-slate-800 mt-0.5">مفتوحة ومجانية 100%</p>
          </div>
        </div>
      </section>

      {/* 3. Operational Administration & Educational Staff Board */}
      <section className="space-y-6" id="staff-board-section">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-royal-blue font-serif">لوحة الشرف: الطاقم الإداري والتربوي بالثانوية</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            أعضاء أسرة إعدادية للا أسماء الساهرين والمشرفين على السير البيداغوجي وتوجيه المتعلمين.
          </p>
          <div className="h-1 w-20 bg-moroccan-gold mx-auto rounded-full mt-2"></div>
        </div>

        {/* Admin Cards ( المدير والحارس العام ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {adminStaff.map((person) => (
            <div 
              key={person.id}
              className="bg-white rounded-xl border-l-4 border-l-royal-blue border-r border-y border-amber-200/30 p-5 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-full text-royal-blue">
                  <UserSquare2 className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{person.name}</h4>
                  <span className="text-xs font-semibold text-moroccan-gold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{person.role}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {person.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Teachers Cards Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4 border-b border-dashed border-amber-205/60 pb-1">
            <h4 className="text-xs text-slate-400 font-bold tracking-wider">
              نخبة من أساتذة ومربيي الأجيال بالمؤسسة
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">الأساتذة المتوفرين: {teachers.length}</span>
          </div>
          
          {isLoadingTeachers ? (
            <div className="text-center py-6 bg-slate-50/50 rounded-lg">
              <span className="text-xs text-slate-400">جاري تحميل قائمة الأساتذة...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <span className="text-xs text-slate-400">لم يتم إدراج أي أساتذة حالياً.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {teachers.map((teacher) => (
                <div 
                  key={teacher.id}
                  className="bg-[#fdfbfa] border border-amber-200/40 rounded-xl p-4 flex flex-col justify-between hover:border-moroccan-gold transition-colors duration-250 hover:shadow-xs group"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-moroccan-gold font-bold text-xs mb-3 font-mono group-hover:bg-royal-blue/10 group-hover:text-royal-blue transition-colors">
                      {teacher.name.charAt(0) === "ا" || teacher.name.charAt(0) === "أ" ? "أ" : teacher.name.charAt(0)}
                    </div>
                    <h5 className="font-bold text-sm text-slate-800 font-serif leading-tight">{teacher.name}</h5>
                    <span className="text-[11px] font-bold text-slate-400 block mt-1">{teacher.subject}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-3 mt-3 pt-3 border-t border-dashed border-slate-100">
                    {teacher.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recognition Card for Salim Al-Jaad (المؤسس والمطور) */}
        <div className="bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-royal-blue/5 border border-amber-200/60 rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs relative overflow-hidden" id="founder-recognition-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-moroccan-gold/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-royal-blue/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 text-right flex-col md:flex-row text-center md:text-right">
            <div className="p-3.5 bg-amber-500/10 text-moroccan-gold rounded-full border border-amber-200/50 shadow-inner flex-shrink-0 animate-pulse">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-moroccan-gold tracking-widest block font-sans">بطاقة تقدير وتكريم خاصّة بالمنصة الرقمية</span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-800 font-serif leading-tight">
                التلميذ سليم الجعد
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                مؤسس هذه المنصة التفاعلية وهو تلميذ في <span className="font-extrabold text-royal-blue">السنة الثانية ثانوي إعدادي</span> بالثانوية الإعدادية للا أسماء.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white/80 backdrop-blur-xs py-2 px-4 rounded-lg border border-amber-200/30 text-center shadow-xs">
            <span className="text-[9.5px] font-bold text-slate-450 block mb-0.5">الصف والمستوى الدراسي</span>
            <span className="text-xs font-extrabold text-slate-700 font-serif">السنة الثانية إعدادي 🎓</span>
          </div>
        </div>
      </section>

      {/* 4. News & Updates (المستجدات والأنشطة) */}
      <section className="space-y-6 pt-4" id="news-section">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-100 text-moroccan-gold">
              <Bookmark className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif" id="school-news-title">قسم مستجدات وإعلانات الثانوية</h3>
          </div>
          
          <button
            id="refresh-news-btn"
            onClick={loadAllHomeData}
            disabled={isLoadingNews}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-moroccan-gold ${isLoadingNews ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </button>
        </div>

        {/* Loading and Error states */}
        {isLoadingNews && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-xl border border-slate-100 shadow-xs">
            <RefreshCw className="h-8 w-8 text-moroccan-gold animate-spin" />
            <span className="text-xs text-slate-500 font-medium">جاري تحديث قائمة المستجدات...</span>
          </div>
        )}

        {errorNews && !isLoadingNews && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs text-center font-medium shadow-xs">
            {errorNews}
          </div>
        )}

        {/* News Grid content */}
        {!isLoadingNews && !errorNews && (
          news.length === 0 ? (
            <div className="bg-white py-12 text-center rounded-xl border border-slate-100 shadow-xs">
              <p className="text-sm text-slate-400 font-medium">لا توجد مستجدات معروضة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="news-grid-cards">
              {news.map((item, index) => (
                <motion.article 
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-amber-200/30 overflow-hidden flex flex-col justify-between shadow-xs transition duration-200 hover:shadow-md hover:border-amber-200"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-amber-100/30 pb-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">إعلان رسمي</span>
                      <span className="font-mono">{item.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug font-serif">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-5">
                      {item.content}
                    </p>
                  </div>

                  {/* Aesthetic Base border decoration */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 text-[11px] font-bold text-royal-blue flex items-center justify-between">
                    <span>إعدادية للا أسماء بمديرية عين السبع</span>
                    <span className="opacity-60 font-serif">الدار البيضاء</span>
                  </div>
                </motion.article>
              ))}
            </div>
          )
        )}
      </section>



    </div>
  );
}
