import React, { useState, useEffect } from "react";
import { 
  KeyRound, 
  Megaphone, 
  FilePlus2, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Clock,
  LogOut,
  GraduationCap,
  Bell,
  Trash2,
  PlusCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  XOctagon
} from "lucide-react";
import { motion } from "motion/react";
import { NotificationItem, TeacherItem } from "../types";

export default function AdminSection() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Ticker form state
  const [tickerInput, setTickerInput] = useState<string>("");
  const [tickerSuccess, setTickerSuccess] = useState<string>("");
  const [tickerError, setTickerError] = useState<string>("");
  const [submittingTicker, setSubmittingTicker] = useState<boolean>(false);

  // News form state
  const [newsTitle, setNewsTitle] = useState<string>("");
  const [newsContent, setNewsContent] = useState<string>("");
  const [newsSuccess, setNewsSuccess] = useState<string>("");
  const [newsError, setNewsError] = useState<string>("");
  const [submittingNews, setSubmittingNews] = useState<boolean>(false);

  // Notifications form state
  const [notifTitle, setNotifTitle] = useState<string>("");
  const [notifMessage, setNotifMessage] = useState<string>("");
  const [notifType, setNotifType] = useState<"warning" | "info" | "success" | "danger">("info");
  const [notifSuccess, setNotifSuccess] = useState<string>("");
  const [notifError, setNotifError] = useState<string>("");
  const [submittingNotif, setSubmittingNotif] = useState<boolean>(false);

  // Administrative notifications control list
  const [adminNotifs, setAdminNotifs] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Teachers form state
  const [teacherName, setTeacherName] = useState<string>("");
  const [teacherSubject, setTeacherSubject] = useState<string>("");
  const [teacherDesc, setTeacherDesc] = useState<string>("");
  const [teacherSuccess, setTeacherSuccess] = useState<string>("");
  const [teacherError, setTeacherError] = useState<string>("");
  const [submittingTeacher, setSubmittingTeacher] = useState<boolean>(false);

  // Teachers list & delete states
  const [adminTeachers, setAdminTeachers] = useState<TeacherItem[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState<number | null>(null);

  // Confirmation state storage (replaces unsafe window.confirm)
  const [confirmDeleteNotifId, setConfirmDeleteNotifId] = useState<number | null>(null);
  const [confirmDeleteTeacherId, setConfirmDeleteTeacherId] = useState<number | null>(null);

  const fetchAdminNotifications = async () => {
    const saved = localStorage.getItem("school_notifications");
    if (saved) {
      setAdminNotifs(JSON.parse(saved));
      return;
    }
    setLoadingNotifs(true);
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setAdminNotifs(data);
        localStorage.setItem("school_notifications", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error loading notifications in admin panel:", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const fetchAdminTeachers = async () => {
    const saved = localStorage.getItem("school_teachers");
    if (saved) {
      setAdminTeachers(JSON.parse(saved));
      return;
    }
    setLoadingTeachers(true);
    try {
      const response = await fetch("/api/teachers");
      if (response.ok) {
        const data = await response.json();
        setAdminTeachers(data);
        localStorage.setItem("school_teachers", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error loading teachers in admin panel:", err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminNotifications();
      fetchAdminTeachers();
    }

    const loadAdminDataFromStore = () => {
      const savedNotifs = localStorage.getItem("school_notifications");
      if (savedNotifs) {
        setAdminNotifs(JSON.parse(savedNotifs));
      }
      const savedTeachers = localStorage.getItem("school_teachers");
      if (savedTeachers) {
        setAdminTeachers(JSON.parse(savedTeachers));
      }
    };

    window.addEventListener("school-data-updated", loadAdminDataFromStore);
    return () => window.removeEventListener("school-data-updated", loadAdminDataFromStore);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "lalla_asmaa_admin") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("الرمز السري المدخل غير صحيح! يرجى إعادة المحاولة.");
    }
  };

  const handlePostNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSuccess("");
    setNotifError("");

    if (!notifTitle.trim() || !notifMessage.trim()) {
      setNotifError("يرجى كتابة عنوان الإشعار ومضمون الرسالة لإتمام النشر.");
      return;
    }

    setSubmittingNotif(true);
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.notifications) {
          localStorage.setItem("school_notifications", JSON.stringify(data.notifications));
          window.dispatchEvent(new Event("school-data-updated"));
        }
        setNotifSuccess("تم نشر وإرسال الإشعار بنجاح! سيظهر فورياً للمستعملين في صندوق الإشعارات.");
        setNotifTitle("");
        setNotifMessage("");
        setNotifType("info");
        // Reload list
        fetchAdminNotifications();
      } else {
        const data = await response.json().catch(() => ({}));
        setNotifError(data.error || "خطأ من جهة الخادم أثناء تدوين الإشعار.");
      }
    } catch (err) {
      console.error(err);
      setNotifError("فشل الاتصال بالخادم.");
    } finally {
      setSubmittingNotif(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (confirmDeleteNotifId !== id) {
      setConfirmDeleteNotifId(id);
      return;
    }

    setDeletingId(id);
    setNotifSuccess("");
    setNotifError("");
    try {
      const response = await fetch("/api/admin/notifications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.notifications) {
          localStorage.setItem("school_notifications", JSON.stringify(data.notifications));
        } else {
          const updated = adminNotifs.filter(n => n.id !== id);
          localStorage.setItem("school_notifications", JSON.stringify(updated));
        }
        window.dispatchEvent(new Event("school-data-updated"));

        setAdminNotifs(prev => prev.filter(n => n.id !== id));
        setNotifSuccess("تم حذف واستبعاد الإشعار بنجاح! اختفى فوراً من لوحة المتعلمين.");
      } else {
        const data = await response.json().catch(() => ({}));
        setNotifError(data.error || "فشل حذف الإشعار من الخادم.");
      }
    } catch (err) {
      console.error(err);
      setNotifError("حدث خطأ ما أثناء الاتصال بالخادم لحذف الإشعار.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteNotifId(null);
    }
  };

  const handlePostTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherSuccess("");
    setTeacherError("");

    if (!teacherName.trim() || !teacherSubject.trim() || !teacherDesc.trim()) {
      setTeacherError("يرجى تعبئة اسم الأستاذ، المادة، والنبذة المختصرة لإستكمال الإدراج.");
      return;
    }

    setSubmittingTeacher(true);
    try {
      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherName,
          subject: teacherSubject,
          desc: teacherDesc,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.teachers) {
          localStorage.setItem("school_teachers", JSON.stringify(data.teachers));
          window.dispatchEvent(new Event("school-data-updated"));
        }
        setTeacherSuccess("تم إدراج الأستاذ بكفاءة وضمه للطاقم التربوي بالصفحة الرئيسية!");
        setTeacherName("");
        setTeacherSubject("");
        setTeacherDesc("");
        fetchAdminTeachers();
      } else {
        const data = await response.json().catch(() => ({}));
        setTeacherError(data.error || "خطأ داخلي من الخادم أثناء حفظ الأستاذ.");
      }
    } catch (err) {
      console.error(err);
      setTeacherError("تعذر الاتصال بالخادم الإداري حالياً.");
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (confirmDeleteTeacherId !== id) {
      setConfirmDeleteTeacherId(id);
      return;
    }

    setDeletingTeacherId(id);
    setTeacherSuccess("");
    setTeacherError("");
    try {
      const response = await fetch("/api/admin/teachers/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.teachers) {
          localStorage.setItem("school_teachers", JSON.stringify(data.teachers));
        } else {
          const updated = adminTeachers.filter(t => t.id !== id);
          localStorage.setItem("school_teachers", JSON.stringify(updated));
        }
        window.dispatchEvent(new Event("school-data-updated"));

        setAdminTeachers(prev => prev.filter(t => t.id !== id));
        setTeacherSuccess("تم حذف وإزالة الأستاذ المحدد بشكل نهائي من قاعدة البيانات.");
      } else {
        const data = await response.json().catch(() => ({}));
        setTeacherError(data.error || "فشل إرسال طلب الشطب من الخادم.");
      }
    } catch (err) {
      console.error(err);
      setTeacherError("حدث عطب أثناء إرسال طلب الحذف.");
    } finally {
      setDeletingTeacherId(null);
      setConfirmDeleteTeacherId(null);
    }
  };

  const handleUpdateTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    setTickerSuccess("");
    setTickerError("");

    if (!tickerInput.trim()) {
      setTickerError("الرجاء إدخال إعلان المستجدات المراد تفعيله.");
      return;
    }

    setSubmittingTicker(true);
    try {
      const response = await fetch("/api/admin/ticker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: tickerInput,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        localStorage.setItem("school_ticker", tickerInput);
        window.dispatchEvent(new Event("school-data-updated"));

        setTickerSuccess("تم تحديث شريط التنبيهات الموائم للثانوية بنجاح! سيظهر التعديل فورياً في أعلى الشاشة.");
        setTickerInput("");
      } else {
        const data = await response.json().catch(() => ({}));
        setTickerError(data.error || "فشل تحديث التنبيهات من جهة الخادم.");
      }
    } catch (err) {
      console.error(err);
      setTickerError("حدث حظر أو عطل في الاتصال بالخادم.");
    } finally {
      setSubmittingTicker(false);
    }
  };

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSuccess("");
    setNewsError("");

    if (!newsTitle.trim() || !newsContent.trim()) {
      setNewsError("يرجى ملء جميع الخانات (عنوان الخبر وتفاصيل الخبر) لإتمام الإجراء.");
      return;
    }

    setSubmittingNews(true);
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
          password: "lalla_asmaa_admin"
        })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.news) {
          localStorage.setItem("school_news", JSON.stringify(data.news));
          window.dispatchEvent(new Event("school-data-updated"));
        }
        setNewsSuccess("تم نشر وإدراج الخبر المستجد بنجاح في لوحة أخبار الصفحة الرئيسية للمتعلمين والمعلمات!");
        setNewsTitle("");
        setNewsContent("");
      } else {
        const data = await response.json().catch(() => ({}));
        setNewsError(data.error || "فشل إرسال المقال من جهة الخادم.");
      }
    } catch (err) {
      console.error(err);
      setNewsError("حدث تعطل في الاتصال بالخادم.");
    } finally {
      setSubmittingNews(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setNewsSuccess("");
    setTickerSuccess("");
  };

  // 1. Lockscreen login gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-amber-250/40 shadow-md p-6 sm:p-8 space-y-6 mt-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-moroccan-gold mx-auto border border-amber-200">
            <KeyRound className="h-5.5 w-5.5" />
          </div>
          <h3 className="text-xl font-bold text-royal-blue font-serif">بوابة الإدارة المحمية</h3>
          <p className="text-xs text-slate-500">
            هذا الفضاء مخصص للسادة الأساتذة والمدير لتعديل الإعلانات ونشر المستجدات بالمؤسسة.
          </p>
        </div>

        <form id="admin-login-form" onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">كلمة السر الإدارية الموحدة:</label>
            <input
              id="admin-password-input"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-300 text-sm focus:outline-none focus:border-royal-blue text-center font-mono"
            />
          </div>

          {authError && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
              <XCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            className="w-full py-2.5 bg-royal-blue hover:bg-royal-hover text-white text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <span>تسجيل الدخول للإدارة</span>
          </button>
        </form>


      </div>
    );
  }

  // 2. Authenticated Admin Deck View
  return (
    <div className="space-y-8">
      
      {/* Top action header info */}
      <div className="bg-white rounded-xl border border-amber-200/40 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-royal-blue">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base font-serif">لوحة تحكم إعدادية للا أسماء</h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">جلسة عمل إدارية آمنة ومفتوحة</span>
          </div>
        </div>

        <button
          id="logout-admin-btn"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>خروج آمن</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Edit slides alert ticker message */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1 rounded bg-amber-50 text-moroccan-gold">
              <Megaphone className="h-5 w-5" />
            </div>
            <h5 className="font-bold text-base text-slate-900 font-serif">تعديل شريط التنبيهات العاجل</h5>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            سيقوم هذا الإجراء بتغيير النص المتحرك المعروض للآباء والمتعلمين في قمة شاشات المنصة فوراً.
          </p>

          <form id="update-ticker-form" onSubmit={handleUpdateTicker} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">نص الإعلان أو التنبيه المقترح:</label>
              <textarea
                id="admin-ticker-textarea"
                rows={3}
                placeholder="اكتب التنويه الإداري هنا..."
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue leading-relaxed font-medium"
              ></textarea>
            </div>

            {tickerSuccess && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{tickerSuccess}</span>
              </div>
            )}

            {tickerError && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <XCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                <span>{tickerError}</span>
              </div>
            )}

            <button
              id="ticker-submit-btn"
              type="submit"
              disabled={submittingTicker}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white transition duration-200 cursor-pointer ${
                submittingTicker ? "bg-slate-300" : "bg-royal-blue hover:bg-royal-hover shadow-xs"
              }`}
            >
              <span>{submittingTicker ? "جاري الحفظ والتدوين..." : "حفظ وبث التنبيه المباشر"}</span>
            </button>
          </form>
        </section>

        {/* Card 2: Publish News Articles */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1 rounded bg-blue-50 text-royal-blue">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <h5 className="font-bold text-base text-slate-900 font-serif">نشر خبر رسمي أو بلاغ تربوي جديد</h5>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            تعبئة نموذج الخبر هذا سيلحق تحديثاً جديداً بشبكة تصفح الأخبار، وسيتاح فوراً للتلاميذ في الشاشات الرئيسية.
          </p>

          <form id="post-news-form" onSubmit={handlePostNews} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">عنوان المقال والمستجد:</label>
              <input
                id="admin-news-title-input"
                type="text"
                placeholder="مثال: فتح حصص الاستدراك بمادة الفيزياء..."
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">تفاصيل وفحوى البلاغ التربوي:</label>
              <textarea
                id="admin-news-content-textarea"
                rows={4}
                placeholder="اكتب كامل البلاغ المدرسي هنا بالتفصيل الموجه للتلاميذ والآباء..."
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue leading-relaxed font-medium"
              ></textarea>
            </div>

            {newsSuccess && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{newsSuccess}</span>
              </div>
            )}

            {newsError && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <XCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                <span>{newsError}</span>
              </div>
            )}

            <button
              id="news-submit-btn"
              type="submit"
              disabled={submittingNews}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white transition duration-200 cursor-pointer ${
                submittingNews ? "bg-slate-300" : "bg-royal-blue hover:bg-royal-hover shadow-xs"
              }`}
            >
              <span>{submittingNews ? "جاري تدوين المستجد المقال..." : "نشر وإشهار المستجد التربوي"}</span>
            </button>
          </form>
        </section>

      </div>

      {/* SECTION 2: Notifications Dispatch & Command Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        
        {/* Card 3: Post new Notification */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1 rounded bg-amber-50 text-moroccan-gold">
              <Bell className="h-5 w-5" />
            </div>
            <h5 className="font-bold text-base text-slate-900 font-serif">إنشاء إشعار رسمي عاجل بصندوق الإشعارات</h5>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            سيقوم هذا النموذج بإنشاء إشعار تفاعلي جديد ملون وموجه للتلاميذ ليتلقوه داخل علبة رسائل الإشعارات.
          </p>

          <form id="post-notification-form" onSubmit={handlePostNotification} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">عنوان الإشعار:</label>
              <input
                id="admin-notif-title-input"
                type="text"
                placeholder="مثال: تأجيل فرض فرض محروس بمادة العلوم..."
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">تصنيف الإشعار ولونه الحافز:</label>
                <select
                  id="admin-notif-type-select"
                  value={notifType}
                  onChange={(e: any) => setNotifType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-medium bg-white"
                >
                  <option value="info">🔵 أزرق - تنبيه إداري عام</option>
                  <option value="warning">🟡 أصفر - رعاية واستنفار</option>
                  <option value="success">🟢 أخضر - بشرى سارة وإنجاز</option>
                  <option value="danger">🔴 أحمر - هام جداً وعاجل</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">نص رسالة الإشعار التوجيهية:</label>
              <textarea
                id="admin-notif-message-textarea"
                rows={3}
                placeholder="اكتب مضمون الإشعار المدرسي هنا بشكل واضح ومبسط..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue leading-relaxed font-medium"
              ></textarea>
            </div>

            {notifSuccess && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{notifSuccess}</span>
              </div>
            )}

            {notifError && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <XCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                <span>{notifError}</span>
              </div>
            )}

            <button
              id="notif-submit-btn"
              type="submit"
              disabled={submittingNotif}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white transition duration-200 cursor-pointer ${
                submittingNotif ? "bg-slate-300" : "bg-royal-blue hover:bg-royal-hover shadow-xs"
              }`}
            >
              <span>{submittingNotif ? "جاري البث والإشهار..." : "نشر الإشعار الملون فوراً"}</span>
            </button>
          </form>
        </section>

        {/* Card 4: Manage/Delete active notifications */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-50 text-red-650">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-base text-slate-900 font-serif">شطب وإلغاء الإشعارات السابقة</h5>
              </div>
              
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-bold">
                الإجمالي: {adminNotifs.length}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              انقر للحذف مرة واحدة لتهيئة زر التأكيد، ثم انقر مجدداً للتأكيد النهائي دون أي نوافذ منبثقة معطلة.
            </p>

            {loadingNotifs ? (
              <div className="text-center py-6 animate-pulse">
                <span className="text-xs text-slate-400">جاري قراءة البيانات الحية...</span>
              </div>
            ) : adminNotifs.length === 0 ? (
              <div className="bg-slate-50/60 p-8 rounded-lg text-center border border-dashed border-slate-200 animate-pulse">
                <span className="text-xs text-slate-400">لا يوجد أي إشعار نشط بالصندوق لعرضه أو حذفه.</span>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {adminNotifs.map((item) => {
                  let borderClass = "border-l-blue-500";
                  let typeLabel = "🔵 إداري";
                  if (item.type === "warning") { borderClass = "border-l-amber-500"; typeLabel = "🟡 تنبيه"; }
                  else if (item.type === "danger") { borderClass = "border-l-red-500"; typeLabel = "🔴 عاجل"; }
                  else if (item.type === "success") { borderClass = "border-l-emerald-500"; typeLabel = "🟢 بشرى"; }

                  return (
                    <div
                      key={item.id}
                      className={`text-right p-3 bg-slate-50/80 rounded-lg border border-slate-250/20 border-l-4 ${borderClass} flex items-start justify-between gap-3 text-xs`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800">{item.title}</span>
                          <span className="text-[9px] text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded font-sans">{typeLabel}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                          {item.message}
                        </p>
                      </div>

                      <button
                        id={`delete-notif-${item.id}`}
                        onClick={() => handleDeleteNotification(item.id)}
                        disabled={deletingId === item.id}
                        className={`p-1 px-2.5 rounded text-xs transition duration-200 cursor-pointer self-center shrink-0 border ${
                          confirmDeleteNotifId === item.id 
                            ? "bg-red-650 text-white border-red-700 animate-pulse font-bold" 
                            : "text-slate-400 hover:text-red-650 hover:bg-red-50 border-transparent hover:border-red-100"
                        }`}
                        title={confirmDeleteNotifId === item.id ? "تأكيد الحذف النهائي" : "شطب وحذف البلاغ"}
                      >
                        {deletingId === item.id ? (
                          <span className="text-[9px]">جاري...</span>
                        ) : confirmDeleteNotifId === item.id ? (
                          <span className="text-[9px]">تأكيد الحذف ؟ ⚠️</span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* SECTION 3: Teachers Registry & Management Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-100 mt-6">
        
        {/* Card 5: Add a new teacher */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1 rounded bg-blue-50 text-royal-blue">
              <PlusCircle className="h-5 w-5" />
            </div>
            <h5 className="font-bold text-base text-slate-900 font-serif">إضافة أستاذ جديد إلى لوحة الشرف</h5>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            سيظهر هذا الاسم والنبذة وتخصص المادة مباشرة في قسم الأساتذة بالصفحة الرئيسية للمؤسسة.
          </p>

          <form id="post-teacher-form" onSubmit={handlePostTeacher} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">اسم الأستاذ الكامل:</label>
              <input
                id="admin-teacher-name-input"
                type="text"
                placeholder="مثال: الأستاذة فاطمة الزهراء الشافعي"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">المادة المقررة والمشرّفة:</label>
              <input
                id="admin-teacher-subject-input"
                type="text"
                placeholder="مثال: علوم الحياة والأرض / التربية الإسلامية"
                value={teacherSubject}
                onChange={(e) => setTeacherSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">نبذة تعريفية وتربوية قصيرة:</label>
              <textarea
                id="admin-teacher-desc-textarea"
                rows={3}
                placeholder="اكتب تخصص الأستاذ أو نبذة موجزة عن جهوده المرافقة للتلاميذ..."
                value={teacherDesc}
                onChange={(e) => setTeacherDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-royal-blue leading-relaxed font-medium"
              ></textarea>
            </div>

            {teacherSuccess && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{teacherSuccess}</span>
              </div>
            )}

            {teacherError && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <XCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                <span>{teacherError}</span>
              </div>
            )}

            <button
              id="teacher-submit-btn"
              type="submit"
              disabled={submittingTeacher}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white transition duration-200 cursor-pointer ${
                submittingTeacher ? "bg-slate-300" : "bg-royal-blue hover:bg-royal-hover shadow-xs"
              }`}
            >
              <span>{submittingTeacher ? "جاري الإضافة والتسجيل..." : "إدارج الأستاذ فوراً ببطاقات التكريم"}</span>
            </button>
          </form>
        </section>

        {/* Card 6: Manage active teachers */}
        <section className="bg-white rounded-xl border border-amber-200/40 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-red-50 text-red-650">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-base text-slate-900 font-serif">شطب وإلغاء الأساتذة من الواجهة</h5>
              </div>
              
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-bold">
                إجمالي الأطر: {adminTeachers.length}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              تصفح وقص الأساتذة من دليل اللوحة الإشهارية بالصفحة الرئيسية. انقر للتهيئة، ثم انقر مجدداً للشطب النهائي.
            </p>

            {loadingTeachers ? (
              <div className="text-center py-6 animate-pulse">
                <span className="text-xs text-slate-400">تحميل الأساتذة المعروضين...</span>
              </div>
            ) : adminTeachers.length === 0 ? (
              <div className="bg-slate-50/60 p-8 rounded-lg text-center border border-dashed border-slate-200 min-h-[150px] flex items-center justify-center animate-pulse">
                <span className="text-xs text-slate-400">لا يوجد أي أستاذ بالواجهة حالياً لعرضه.</span>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {adminTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="text-right p-3 bg-slate-50/80 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{teacher.name}</span>
                        <span className="text-[9px] text-royal-blue bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded font-sans">{teacher.subject}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                        {teacher.desc}
                      </p>
                    </div>

                    <button
                      id={`delete-teacher-${teacher.id}`}
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      disabled={deletingTeacherId === teacher.id}
                      className={`p-1 px-2.5 rounded text-xs transition duration-200 cursor-pointer self-center shrink-0 border ${
                        confirmDeleteTeacherId === teacher.id 
                          ? "bg-red-600 text-white border-red-700 animate-pulse font-bold text-[9px] py-1" 
                          : "text-slate-400 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-100"
                      }`}
                      title={confirmDeleteTeacherId === teacher.id ? "تأكيد حذف الأستاذ" : "شطب الأستاذ"}
                    >
                      {deletingTeacherId === teacher.id ? (
                        <span className="text-[9px]">جاري...</span>
                      ) : confirmDeleteTeacherId === teacher.id ? (
                        "تأكيد؟ ⚠️"
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
