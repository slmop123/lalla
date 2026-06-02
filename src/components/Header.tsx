import React from "react";
import { ActiveTab } from "../types";
import { BookOpen, MessageSquareText, ShieldAlert, GraduationCap, MapPin, Bell } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-royal-blue text-white shadow-md relative overflow-hidden">
      {/* Visual Golden traditional Moroccan border */}
      <div className="h-1.5 w-full bg-moroccan-gold zellij-border"></div>

      {/* Ambient glowing pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-royal-hover/40 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Ministry & School Branding */}
          <div className="flex items-center gap-4">
            {/* Custom Golden Royal Seal Icon */}
            <div className="hidden sm:flex p-3 bg-amber-500/10 rounded-full border border-moroccan-gold/40 shadow-inner">
              <GraduationCap className="h-9 w-9 text-moroccan-gold animate-pulse" />
            </div>
            
            <div>
              <div className="text-xs text-moroccan-gold font-bold tracking-wider flex items-center gap-1.5">
                <span>المملكة المغربية</span>
                <span className="opacity-40">•</span>
                <span>وزارة التربية الوطنية والتعليم الأولي والرياضة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight mt-1">
                الثانوية الإعدادية للا أسماء
              </h1>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="h-3 w-3 text-moroccan-gold" />
                <span>عين السبع، الدار البيضاء</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2 self-start md:self-center flex-wrap">
            {/* Home Tab */}
            <button
              id="home-tab-btn"
              onClick={() => setActiveTab("home")}
              className={`relative px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition duration-250 cursor-pointer ${
                activeTab === "home" 
                  ? "text-royal-blue bg-soft-beige font-bold shadow-md" 
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>الصفحة الرئيسية</span>
              {activeTab === "home" && (
                <motion.div 
                  layoutId="active-nav" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-moroccan-gold rounded-b-lg"
                />
              )}
            </button>

            {/* Chat Tab - "شاهين 01" */}
            <button
              id="chat-tab-btn"
              onClick={() => setActiveTab("chat")}
              className={`relative px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition duration-250 cursor-pointer ${
                activeTab === "chat" 
                  ? "text-royal-blue bg-soft-beige font-bold shadow-md" 
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <MessageSquareText className="h-4.5 w-4.5 text-royal-blue sm:text-moroccan-gold" />
              <span className="flex items-center gap-1">
                <span>بوابة الامتحانات</span>
                <span className="bg-traditional-clay text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold animate-bounce">
                  شاهين 01
                </span>
              </span>
              {activeTab === "chat" && (
                <motion.div 
                  layoutId="active-nav" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-moroccan-gold rounded-b-lg"
                />
              )}
            </button>

            {/* Notifications Tab */}
            <button
              id="notifications-tab-btn"
              onClick={() => setActiveTab("notifications")}
              className={`relative px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition duration-250 cursor-pointer ${
                activeTab === "notifications" 
                  ? "text-royal-blue bg-soft-beige font-bold shadow-md" 
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              <span>صندوق الإشعارات</span>
              {activeTab === "notifications" && (
                <motion.div 
                  layoutId="active-nav" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-moroccan-gold rounded-b-lg"
                />
              )}
            </button>

            {/* Admin Hidden Tab */}
            <button
              id="admin-tab-btn"
              onClick={() => setActiveTab("admin")}
              className={`relative px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition duration-250 cursor-pointer ${
                activeTab === "admin" 
                  ? "text-royal-blue bg-soft-beige font-bold shadow-md" 
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>الإدارة</span>
              {activeTab === "admin" && (
                <motion.div 
                  layoutId="active-nav" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-moroccan-gold rounded-b-lg"
                />
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}
