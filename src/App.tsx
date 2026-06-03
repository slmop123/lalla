import React, { useState } from "react";
import { ActiveTab } from "./types";
import Header from "./components/Header";
import MarqueeTicker from "./components/MarqueeTicker";
import HomeSection from "./components/HomeSection";
import ChatSection from "./components/ChatSection";
import AdminSection from "./components/AdminSection";
import NotificationsSection from "./components/NotificationsSection";
import StaffSection from "./components/StaffSection";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  return (
    <div className="min-h-screen flex flex-col zellij-pattern text-slate-850">
      
      {/* 1. Traditional Upper Moroccan Header Tab controls */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Top alerts scrolling marquee */}
      <MarqueeTicker />

      {/* 3. Central dynamic viewport container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <HomeSection onGoToChat={() => setActiveTab("chat")} />
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ChatSection />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AdminSection />
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <NotificationsSection />
            </motion.div>
          )}

          {activeTab === "staff" && (
            <motion.div
              key="staff-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <StaffSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Elegant footer detailing */}
      <footer className="bg-royal-blue text-white/70 py-6 border-t border-moroccan-gold/30 mt-auto text-center relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2 font-serif font-semibold">
            <span className="text-moroccan-gold text-sm">✦</span>
            <span>بوابة الثانوية الإعدادية للا أسماء بمديرية عين السبع بالدار البيضاء</span>
          </div>

          <div className="text-slate-400 flex flex-col items-center gap-1">
            <span>جميع الحقوق بيداغوجية ومحفوظة © ٢٠٢٦ للمدرسه الإلكترونية</span>
            <span className="bg-amber-500/10 text-moroccan-gold py-0.5 px-2 rounded border border-moroccan-gold/15 font-serif font-bold text-[10px] tracking-wide mt-1 animate-pulse">
              الموقع من تأسيس سليم الجعد التلميذ 🎓
            </span>
          </div>

          <div>
            <span className="bg-amber-500/15 text-moroccan-gold py-1 px-3.5 rounded-full border border-moroccan-gold/20 font-bold">
              مكتبة الذكاء الاصطناعي الأكاديمي "شاهين 01" فعال الآن
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
