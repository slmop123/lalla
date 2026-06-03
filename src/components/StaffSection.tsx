import React, { useState, useEffect } from "react";
import { 
  Lock, 
  KeyRound, 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Trash2,
  BookmarkCheck,
  Megaphone,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getSubjects, 
  addNotification, 
  getNotifications, 
  deleteNotification, 
  setTicker, 
  isCloudSyncEnabled,
  SchoolSubject 
} from "../lib/supabaseClient";
import { NotificationItem } from "../types";

export default function StaffSection() {
  // Authentication state
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("staff_logged_in") === "true";
  });
  const [authError, setAuthError] = useState<string>("");

  // Subjects & notifications state
  const [subjects, setSubjects] = useState<SchoolSubject[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SchoolSubject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New notification form state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [notifType, setNotifType] = useState<"info" | "warning" | "success" | "danger">("info");
  const [updateTickerToo, setUpdateTickerToo] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const DEFAULT_STAFF_PASSWORD = "lalla_asmaa_teacher";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (password.trim() === DEFAULT_STAFF_PASSWORD) {
      sessionStorage.setItem("staff_logged_in", "true");
      setIsAuthenticated(true);
    } else {
      setAuthError("رمز المرور المدخل غير صحيح! يرجى إعادة المحاولة من فضلك.");
    }
  };

  const loadPortalData = async () => {
    setIsLoading(true);
    try {
      const dbSubjects = await getSubjects();
      setSubjects(dbSubjects);

      const dbNotifs = await getNotifications();
      setNotifications(dbNotifs);
    } catch (err) {
      console.error("Error loading staff workspace data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPortalData();
    }
  }, [isAuthenticated]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    
    setFormSuccess("");
    setFormError("");

    if (!newTitle.trim() || !newContent.trim()) {
      setFormError("يرجى ملء جميع الحقول البيداغوجية قبل النشر!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Publish Notification linked to this Subject
      const fullTitle = `[مادة ${selectedSubject.name}] - ${newTitle.trim()}`;
      const success = await addNotification(fullTitle, newContent.trim(), notifType, selectedSubject.name);
      
      if (!success) {
        throw new Error("فشلت عملية حفظ المستند السحابي.");
      }

      // 2. If requested, also update the high-priority marquee ticker!
      if (updateTickerToo) {
        const tickerMessage = `📢 إشعار عاجل لمادة ${selectedSubject.name}: ${newTitle.trim()} - تفاصيل الدرس والمحتوى بصندوق الإشعارات الرئيسي بالموقع!`;
        await setTicker(tickerMessage);
      }

      setFormSuccess(`تم بنجاح نشر الإشعار الخاص بمادة (${selectedSubject.name}) وتعميمه فوراً على التلاميذ!`);
      setNewTitle("");
      setNewContent("");
      setUpdateTickerToo(false);
      
      // Reload lists
      const updatedNotifs = await getNotifications();
      setNotifications(updatedNotifs);
    } catch (err) {
      console.error("Error publishing lesson notice:", err);
      setFormError("حدث خطأ أثناء الاتصال المباشر بقاعدة البيانات السحابية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("staff_logged_in");
    setIsAuthenticated(false);
    setSelectedSubject(null);
  };

  // Filter notifications belonging to the current selected subject
  const currentSubjectNotifs = notifications.filter(
    n => n.subject && n.subject.toLowerCase() === selectedSubject?.name.toLowerCase()
  );

  return (
    <div id="staff-portal-workspace" className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      
      {!isAuthenticated ? (
        /* Login Form */
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-amber-200/55 p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-moroccan-gold"></div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 bg-royal-blue/15 rounded-full flex items-center justify-center text-royal-blue">
              <Lock className="h-7 w-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-royal-blue">فضاء الأطر التربوية والتدريس</h3>
              <p className="text-xs text-slate-500">
                بوابة مغلقة ومحمية مخصصة لأساتذة الثانوية الإعدادية للا أسماء لنشر الدروس وتوجيهات الامتحان.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة مرور الأستاذ المقررة:</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل الرمز السري للأستاذ..."
                  required
                  className="w-full text-center px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-royal-blue rounded-xl text-sm transition outline-none"
                />
                <KeyRound className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-royal-blue hover:bg-royal-hover text-white rounded-xl shadow font-bold text-sm tracking-wide transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>تسجيل الدخول الآمن</span>
              <ArrowRight className="h-4 w-4 text-moroccan-gold" />
            </button>
          </form>

          <div className="mt-8 border-t border-dashed border-slate-100 pt-5 text-center">
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/50 font-semibold font-mono inline-block">
              💡 الرمز الافتراضي المعتمد للتجربة: lalla_asmaa_teacher
            </span>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* Header Dashboard section */}
          <div className="bg-white rounded-2xl border border-amber-200/40 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-moroccan-gold rounded-full border border-moroccan-gold/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-royal-blue">مكتبة الأطر التربوية ومكلفي المواد</h3>
                <p className="text-xs text-slate-500">
                  يرجى اختيار مادتك الدراسية لإدارتها وتعليق الدروس والمراجعات للتلاميذ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={loadPortalData}
                disabled={isLoading}
                className="px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-moroccan-gold ${isLoading ? "animate-spin" : ""}`} />
                <span>تحديث البيانات</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 text-xs font-bold transition cursor-pointer"
              >
                <span>خروج آمن</span>
              </button>
            </div>
          </div>

          {/* Subjects Grid Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Subjects Sidebar Selector */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-royal-blue text-white p-4 rounded-xl shadow-xs border border-royal-hover relative overflow-hidden">
                <div className="absolute right-0 bottom-0 h-16 w-16 bg-white/5 rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-moroccan-gold" />
                  <span className="font-bold text-sm">المواد الدراسية المقررة</span>
                </div>
                <p className="text-[11px] text-slate-200 mt-1">
                  اختر مادتك لكتابة مذكرة بيداغوجية حية.
                </p>
              </div>

              {isLoading ? (
                <div className="p-10 text-center text-slate-400 bg-white border border-slate-100 rounded-xl flex flex-col items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-moroccan-gold animate-spin" />
                  <span className="text-xs">جاري سحب المواد البنائية...</span>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-xs space-y-1.5 max-h-[420px] overflow-y-auto">
                  {subjects.map((sub) => {
                    const isSelected = selectedSubject?.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubject(sub);
                          setFormSuccess("");
                          setFormError("");
                        }}
                        className={`w-full text-right p-3 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                          isSelected 
                            ? "bg-royal-blue text-white border-royal-blue shadow-sm" 
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`${isSelected ? "text-moroccan-gold" : "text-royal-blue"} text-sm`}>✦</span>
                          <span>{sub.name}</span>
                        </span>
                        {sub.is_default && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isSelected ? "bg-white/10 text-white" : "bg-blue-50 text-blue-600"}`}>
                            أساسية
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Editing / Notification Area */}
            <div className="md:col-span-2 space-y-4">
              {selectedSubject ? (
                <div className="bg-white rounded-xl border border-amber-200/30 p-5 sm:p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-3 border-dashed border-slate-150">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-moroccan-gold tracking-wide bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                        العمل جاري في السحابة مادة:
                      </span>
                      <h4 className="text-lg font-bold text-royal-blue font-serif">{selectedSubject.name}</h4>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Clock className="h-3.5 w-3.5 text-moroccan-gold" />
                      <span>{new Date().toLocaleDateString("ar-MA", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Form for new lesson or notice */}
                  <form onSubmit={handlePublish} className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <PlusCircle className="h-4 w-4 text-royal-blue" />
                      <span>إدراج مستجد طارئ أو كبسولة درس جديدة</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">عنوان الإشعار أو الدرس:</label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="مثال: موعد اختبار تجريبي، درس الدعم للفرنسية..."
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-royal-blue bg-neutral-50 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">درجة الأهمية (الأيقونة):</label>
                        <select
                          value={notifType}
                          onChange={(e: any) => setNotifType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-royal-blue"
                        >
                          <option value="info">إرشادية (زرقاء)</option>
                          <option value="warning">تنبيه طفيف (برتقالية)</option>
                          <option value="success">إعلان سار / بشرى (خضراء)</option>
                          <option value="danger">عاجل جداً (حمراء)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">الوصف التفصيلي لموضوع و محتوى الإشعار:</label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="اكتب التوجيهات البيداغوجية، قاعات التعويض، موعد الامتحانات، أو ملخصات لكي تظهر للتلاميذ على الفور..."
                        rows={4}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-royal-blue bg-neutral-50 focus:bg-white transition"
                      ></textarea>
                    </div>

                    {/* Marquee Ticker Toggle */}
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="marquee-toggle"
                        checked={updateTickerToo}
                        onChange={(e) => setUpdateTickerToo(e.target.checked)}
                        className="h-4 w-4 rounded text-royal-blue accent-royal-blue shadow-xs focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="marquee-toggle" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 select-none">
                        <Megaphone className="h-4 w-4 text-traditional-clay" />
                        <span>بث وتعميم هذا الإشعار في "شريط المستجدات العاجلة" بالصفحة الرئيسية أيضاً لضمان رؤيته!</span>
                      </label>
                    </div>

                    {formSuccess && (
                      <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{formSuccess}</span>
                      </div>
                    )}

                    {formError && (
                      <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs flex items-center gap-2 font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-royal-blue hover:bg-royal-hover disabled:bg-slate-350 text-white rounded-xl shadow font-semibold text-xs tracking-wide transition cursor-pointer flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>جاري النشر وتحديث السحابة...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>نشر الإشعار وتعميمه فوراً</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Log of Subject-Specific historic notices */}
                  <div className="space-y-3 pt-3 border-t border-dashed border-slate-150">
                    <h5 className="text-xs font-bold text-slate-700 font-serif">
                      الإشعارات المنشورة سابقاً في مادتك ({currentSubjectNotifs.length}):
                    </h5>

                    {currentSubjectNotifs.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        لا توجد مذكرات خاصة بمادتك معروضة للتلاميذ حالياً.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {currentSubjectNotifs.map((item) => (
                          <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h6 className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-royal-blue"></span>
                                <span>{item.title}</span>
                              </h6>
                              <p className="text-slate-500 font-medium leading-relaxed">
                                {item.message}
                              </p>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                تاريخ النشر: {item.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[300px]">
                  <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                    <GraduationCap className="h-10 w-10 text-moroccan-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-royal-blue font-serif">فضاء النشر جاهز للعمل</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      الرجاء تصفح وتحديد المادة الدراسية الخاصة بك من اللائحة الجانبية للبدء فوراً في تحرير ونشر الدروس والإرشادات للتلاميذ.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
