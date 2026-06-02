import React, { useState, useEffect } from "react";
import { NotificationItem } from "../types";
import { 
  Bell, 
  BellRing,
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  XOctagon,
  CalendarDays,
  Sparkles,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getNotificationsLocal } from "../lib/schoolData";

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const loadNotifications = () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // Server reversed notifications list to show newest on top
      const localNotifs = getNotificationsLocal();
      setNotifications(localNotifs.slice().reverse());
    } catch (err) {
      console.error("Error loading notifications:", err);
      setErrorMsg("عطل في سحب البيانات المحلية.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    window.addEventListener("school-data-updated", loadNotifications);
    return () => window.removeEventListener("school-data-updated", loadNotifications);
  }, []);

  // Helper for notification type colors & icons
  const getTypeConfig = (type: NotificationItem["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200/60",
          text: "text-amber-800",
          icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
          badge: "رعاية مستمرة",
          badgeBg: "bg-amber-100 text-amber-800 border-amber-200"
        };
      case "danger":
        return {
          bg: "bg-red-50 border-red-200/60",
          text: "text-red-800",
          icon: <XOctagon className="h-5 w-5 text-red-600 shrink-0" />,
          badge: "هام جداً",
          badgeBg: "bg-red-100 text-red-800 border-red-200"
        };
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-200/60",
          text: "text-emerald-800",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
          badge: "بشرى سارة",
          badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200"
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200/60",
          text: "text-blue-800",
          icon: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
          badge: "تعميم إداري",
          badgeBg: "bg-blue-100 text-blue-800 border-blue-200"
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="notifications-viewport">
      
      {/* Upper informational card */}
      <section className="bg-white rounded-2xl border border-amber-200/40 p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-moroccan-gold/10 rounded-full blur-lg pointer-events-none"></div>
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3 bg-royal-blue/10 rounded-full text-royal-blue">
            <BellRing className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-royal-blue font-serif">صندوق الإشعارات والمذكرات الرسمية</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              هنا تجد المذكرات التربوية وآخر التوجيهات الطارئة الصادرة مباشرة من إدارة الثانوية الإعدادية للا أسماء.
            </p>
          </div>
        </div>

        <button
          id="refresh-notifications-btn"
          onClick={loadNotifications}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold transition duration-200 cursor-pointer self-start sm:self-center shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-moroccan-gold ${isLoading ? "animate-spin" : ""}`} />
          <span>تحديث الصندوق</span>
        </button>
      </section>

      {/* Loading State view */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-center shadow-xs">
          <RefreshCw className="h-8 w-8 text-moroccan-gold animate-spin" />
          <span className="text-xs text-slate-500 font-medium">جاري تحديث صندوق الإشعارات من خادم المؤسسة...</span>
        </div>
      )}

      {/* Error state */}
      {errorMsg && !isLoading && (
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-xs text-center font-medium shadow-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Notifications Log */}
      {!isLoading && !errorMsg && (
        notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-200/20 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xs">
            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
              <Inbox className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 font-serif">صندوق الإشعارات فارغ حالياً</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                لم يتم إدراج أي مذكرات عامة مؤخراً. سيقوم المشرف الإداري أو الحارس العام بنشر التعميمات هنا حال صدورها.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {notifications.map((notif, index) => {
                const config = getTypeConfig(notif.type);
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl border-l-[6px] ${notif.type === 'warning' ? 'border-l-amber-500' : notif.type === 'danger' ? 'border-l-red-500' : notif.type === 'success' ? 'border-l-emerald-500' : 'border-l-royal-blue'} p-5 sm:p-6 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow`}
                  >
                    {/* State Icon wrapping */}
                    <div className="p-2 rounded-lg bg-slate-50">
                      {config.icon}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        
                        {/* Title of the message with type badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                            {notif.title}
                          </h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${config.badgeBg}`}>
                            {config.badge}
                          </span>
                        </div>

                        {/* Date field */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold font-mono">
                          <CalendarDays className="h-3 w-3 text-moroccan-gold" />
                          <span>{notif.date}</span>
                        </div>

                      </div>

                      {/* Msg Description content */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {notif.message}
                      </p>

                      {/* Static signature indicator */}
                      <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-dashed border-slate-50 mt-1">
                        <span>إدارة الإعدادية بعين السبع</span>
                        <div className="flex items-center gap-1 text-moroccan-gold">
                          <Sparkles className="h-3 w-3" />
                          <span>صادر ومعتمد</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400">
                لقد طالعت كافة التنبيهات المنشورة بصندوق الإشعارات.
              </p>
            </div>
          </div>
        )
      )}

    </div>
  );
}
