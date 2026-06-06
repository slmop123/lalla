import { createClient } from "@supabase/supabase-js";
import { NewsItem, NotificationItem, TeacherItem } from "../types";

export interface SchoolSubject {
  id: number;
  name: string;
  is_default: boolean;
}

const DEFAULT_SUBJECTS: SchoolSubject[] = [
  { id: 1, name: "اللغة الإنجليزية", is_default: true },
  { id: 2, name: "التربية الإسلامية", is_default: true },
  { id: 3, name: "الفيزياء والكيمياء", is_default: true },
  { id: 4, name: "علوم الحياة والأرض", is_default: true },
  { id: 5, name: "التكنولوجيا الصناعية", is_default: true },
  { id: 6, name: "المعلوميات", is_default: true },
  { id: 7, name: "اللغة العربية", is_default: true },
  { id: 8, name: "اللغة الفرنسية", is_default: true },
  { id: 9, name: "الرياضيات", is_default: true },
  { id: 10, name: "التربية البدنية والرياضية", is_default: true },
  { id: 11, name: "الاجتماعيات", is_default: true }
];

// Read environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "YOUR_SUPABASE_URL" && 
  supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY" &&
  supabaseUrl.trim() !== ""
);

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Display status banner state
export function isCloudSyncEnabled(): boolean {
  return !!supabase;
}

// Fallbacks are read from LocalStorage or the default arrays
const defaultTicker = "📢 تنبيه هام: ننهي إلى علم تلميذات وتلاميذ السنة الثالثة إعدادي أن حصص الدعم المكثفة تحضيراً للامتحان الجهوي الموحد مستمرة يومياً بالمؤسسة. يرجى الاتصال بالحارس العام لتسلم جداول التوقيت والتحضير مع أستاذكم الرقمي 'شاهين 01'!";

const defaultNews: NewsItem[] = [
  {
    id: 1,
    title: "إطلاق المراجعات الشاملة للامتحان الجهوي الموحد",
    content: "تعلن إدارة الثانوية الإعدادية للا أسماء بمديرية عين السبع الحي المحمدي، عن إطلاق جدول حصص الدعم والتقوية التربوية المخصصة لتلاميذ السنة الثالثة إعدادي في مختلف المواد المقررة جهوياً (العربية، الفرنسية، الرياضيات، الفيزياء الكيمياء، علوم الحياة والأرض، التربية الإسلامية، والاجتماعيات). ندعو كافة أمهات وآباء وأولياء المتعلمين إلى حث أبنائهم على الالتزام بحضور هذه المراجعات الهامة.",
    date: "2026-06-01"
  },
  {
    id: 2,
    title: "نجاح حفل ختام الأنشطة الرياضية وتتويج فرق الإعدادية",
    content: "في جو بهيج مفعم بالروح الرياضية والاحتفالية، أشرف السيد المدير بوجمعة والطاقم التربوي والرياضي في المؤسسة بقيادة أستاذ التربية البدنية يونس الدنكاطي على حفل توزيع الدروع والميداليات على بطلات وأبطال إعدادية للا أسماء الفائزين في دوريات كرة القدم وكرة السلة للموسم الدراسي الحالي، تكريماً لجهودهم وتألقهم الاستثنائي وسلوكهم المثالي داخل رقعة اللعب وخارجها.",
    date: "2026-05-25"
  },
  {
    id: 3,
    title: "اجتماع تواصل هام لمجلس التدبير مع جمعية أولياء الأمور",
    content: "تنظم إعدادية للا أسماء بمديرية عين السبع لقاءً تواصلياً تفاعلياً يجمع الطاقم التربوي الإداري برئاسة السيد المدير بوجمعة والسيد العجيلي الحارس العام مع أولياء أمور التلميذات والتلاميذ لتدارس نتائج المراقبة المستمرة لمرحلة الأسدس الثاني، والوقوف عن كثب على الجاهزية التربوية والنفسية للمتعلمين تحضيراً للامتحان الإشهادي الموحد المقبل وضمان المرافقة المنزلية الداعمة والمطمئنة.",
    date: "2026-05-18"
  }
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "تغيير مؤقت في قاعات الدعم لمادة الفيزياء والكيمياء",
    message: "نحيط تلاميذ المستوى الثالثة إعدادي علماً أنه تقرر نقل حصص الدعم الخاصة بمادة الفيزياء والكيمياء ليوم غد الأربعاء من القاعة 4 إلى القاعة المتعددة الوسائط (Médiathèque) لتسهيل العروض التجريبية والمحاكاة التفاعلية.",
    date: "2026-06-02",
    type: "warning"
  },
  {
    id: 2,
    title: "الاستعداد لتسليم استدعاءات الامتحان الجهوي المستقل",
    message: "نهيب بكافة المترشحين للامتحان الموحد الإشهادي الحضور يوم الجمعة المقبل مصحوبين بالبطاقة المدرسية لتسلم الاستدعاء الرسمي وميثاق الامتحان من مكتب الحارس العام السيد العجيلي.",
    date: "2026-06-01",
    type: "info"
  },
  {
    id: 3,
    title: "تتويج تلميذات الثانوية بمسابقة تحدي القراءة الجهوي",
    message: "تتقدم الأطر التربوية والإدارية بأحر التهاني للتلميذات المتألقات اللواتي مثلن الثانوية الإعدادية للا أسماء خير تمثيل في مسابقة تحدي القراءة وتحصلن على مراتب أولى متقدمة على صعيد الدار البيضاء.",
    date: "2026-05-28",
    type: "success"
  }
];

const defaultTeachers: TeacherItem[] = [
  { id: 1, name: "علي المسعودي", subject: "التكنولوجيا الصناعية", desc: "بناء التفكير التقني وتطوير المشاريع الابتكارية البسيطة لطلاب السلك الإعدادي." },
  { id: 2, name: "الأستاذ أكار", subject: "اللغة العربية", desc: "تنمية الذوق الأدبي والتمكن من قواعد اللسان العربي والتحضير البلاغي الموجه للامتحان الجهوي." },
  { id: 3, name: "الأستاذة عمارة", subject: "اللغة العربية", desc: "التأهيل اللغوي المكثف والمرافقة التربوية والدعم الفردي في دروس النصوص والإنشاء." },
  { id: 4, name: "يونس الدنكاطي", subject: "التربية البدنية والرياضية", desc: "تنمية الصحة البدنية والرفع من قيم التضامن والمنافسة الإيجابية والروح الرياضية العالية." },
  { id: 5, name: "الأستاذ كحيل", subject: "اللغة الفرنسية", desc: "تحسين مهارات التعبير الكتابي والشفهي والإعداد للامتحان في مادة اللغة الأجنبية الأولى." }
];

// Helper to broadcast status changes
const notifyUpdate = () => {
  window.dispatchEvent(new Event("school-data-updated"));
};

// Initialize localStorage if not present
function initLocalStorage() {
  if (!localStorage.getItem("school_subjects")) {
    localStorage.setItem("school_subjects", JSON.stringify(DEFAULT_SUBJECTS));
  }
  if (!localStorage.getItem("school_ticker")) {
    localStorage.setItem("school_ticker", defaultTicker);
  }
  if (!localStorage.getItem("school_news")) {
    localStorage.setItem("school_news", JSON.stringify(defaultNews));
  }
  if (!localStorage.getItem("school_notifications")) {
    localStorage.setItem("school_notifications", JSON.stringify(defaultNotifications));
  }
  if (!localStorage.getItem("school_teachers")) {
    localStorage.setItem("school_teachers", JSON.stringify(defaultTeachers));
  }
}

// Global seeding & initial setup helper
export async function seedInitialCloudData() {
  if (!supabase) {
    initLocalStorage();
    return;
  }

  try {
    // 1. Seed Ticker settings
    try {
      const { data: tickerData, error: tickerError } = await supabase
        .from("school_settings")
        .select("*")
        .eq("key", "ticker");
      if (!tickerError && (!tickerData || tickerData.length === 0)) {
        await supabase.from("school_settings").insert({ key: "ticker", value: defaultTicker });
      }
    } catch (err) {
      console.warn("Could not seed school_settings ticker:", err);
    }

    // 2. Seed Subjects
    try {
      const { data: subData, error: subError } = await supabase
        .from("subjects")
        .select("id")
        .limit(1);
      if (!subError && (!subData || subData.length === 0)) {
        const seedPayload = DEFAULT_SUBJECTS.map(s => ({ name: s.name }));
        await supabase.from("subjects").insert(seedPayload);
      }
    } catch (err) {
      console.warn("Could not seed subjects table:", err);
    }

    // 3. Seed Notifications
    try {
      const { data: notifData, error: notifError } = await supabase
        .from("announcements")
        .select("id")
        .limit(1);
      if (!notifError && (!notifData || notifData.length === 0)) {
        await supabase.from("announcements").insert(
          defaultNotifications.map(n => ({
            title: n.title,
            content: n.message,
            subject_name: ""
          }))
        );
      }
    } catch (err) {
      console.warn("Could not seed announcements table:", err);
    }

    // 4. Seed News
    try {
      const { data: newsData, error: newsError } = await supabase
        .from("school_news")
        .select("id")
        .limit(1);
      if (!newsError && (!newsData || newsData.length === 0)) {
        await supabase.from("school_news").insert(defaultNews);
      }
    } catch (err) {
      console.warn("Could not seed school_news table:", err);
    }

    // 5. Seed Teachers
    try {
      const { data: teachData, error: teachError } = await supabase
        .from("school_teachers")
        .select("id")
        .limit(1);
      if (!teachError && (!teachData || teachData.length === 0)) {
        await supabase.from("school_teachers").insert(defaultTeachers);
      }
    } catch (err) {
      console.warn("Could not seed school_teachers table:", err);
    }
  } catch (err) {
    console.error("Error seeding initial Cloud data:", err);
  }
}

// ---------------------------------
// 1. Ticker APIs
// ---------------------------------
export async function getTicker(): Promise<string> {
  if (!supabase) {
    initLocalStorage();
    return localStorage.getItem("school_ticker") || defaultTicker;
  }
  try {
    const { data, error } = await supabase
      .from("school_settings")
      .select("value")
      .eq("key", "ticker")
      .single();
    if (error || !data) return defaultTicker;
    return data.value;
  } catch {
    return defaultTicker;
  }
}

export async function setTicker(msg: string): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    localStorage.setItem("school_ticker", msg);
    notifyUpdate();
    return true;
  }
  try {
    const { error } = await supabase
      .from("school_settings")
      .upsert({ key: "ticker", value: msg }, { onConflict: "key" });
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error setting ticker:", err);
    return false;
  }
}

// ---------------------------------
// 2. News APIs
// ---------------------------------
export async function getNews(): Promise<NewsItem[]> {
  if (!supabase) {
    initLocalStorage();
    try {
      const raw = localStorage.getItem("school_news");
      return raw ? JSON.parse(raw) : defaultNews;
    } catch {
      return defaultNews;
    }
  }
  try {
    const { data, error } = await supabase
      .from("school_news")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    return data as NewsItem[];
  } catch (err) {
    console.error("Error getting news:", err);
    return defaultNews;
  }
}

export async function addNews(title: string, content: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getNews();
      const nextId = current.length > 0 ? Math.max(...current.map(n => n.id)) + 1 : 1;
      const updated = [
        ...current,
        { id: nextId, title: title.trim(), content: content.trim(), date: today }
      ];
      localStorage.setItem("school_news", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("school_news")
      .insert({ title: title.trim(), content: content.trim(), date: today });
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error adding news:", err);
    return false;
  }
}

// ---------------------------------
// 3. Teachers APIs
// ---------------------------------
export async function getTeachers(): Promise<TeacherItem[]> {
  if (!supabase) {
    initLocalStorage();
    try {
      const raw = localStorage.getItem("school_teachers");
      return raw ? JSON.parse(raw) : defaultTeachers;
    } catch {
      return defaultTeachers;
    }
  }
  try {
    const { data, error } = await supabase
      .from("school_teachers")
      .select("id, name, specialty")
      .order("id", { ascending: true });
    if (error) throw error;
    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      subject: item.specialty || "",
      desc: ""
    })) as TeacherItem[];
  } catch (err) {
    console.error("Error getting teachers:", err);
    return defaultTeachers;
  }
}

export async function addTeacher(name: string, subject: string, desc: string = ""): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getTeachers();
      const nextId = current.length > 0 ? Math.max(...current.map(t => t.id)) + 1 : 1;
      const updated = [
        ...current,
        { id: nextId, name: name.trim(), subject: subject.trim(), desc }
      ];
      localStorage.setItem("school_teachers", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("school_teachers")
      .insert({ name: name.trim(), specialty: subject.trim() });
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error adding teacher:", err);
    return false;
  }
}

export async function updateTeacher(id: number, name: string, subject: string): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getTeachers();
      const updated = current.map((t) => t.id === id ? { ...t, name: name.trim(), subject: subject.trim() } : t);
      localStorage.setItem("school_teachers", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("school_teachers")
      .update({ name: name.trim(), specialty: subject.trim() })
      .eq("id", id);
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error updating teacher:", err);
    return false;
  }
}

export async function deleteTeacher(id: number): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getTeachers();
      const updated = current.filter(t => t.id !== id);
      localStorage.setItem("school_teachers", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("school_teachers")
      .delete()
      .eq("id", id);
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error deleting teacher:", err);
    return false;
  }
}

// ---------------------------------
// 4. Subjects (Dynamic CRUD) APIs
// ---------------------------------
export async function getSubjects(): Promise<SchoolSubject[]> {
  if (!supabase) {
    initLocalStorage();
    try {
      const raw = localStorage.getItem("school_subjects");
      return raw ? JSON.parse(raw) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  }
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return (data || []).map((item, index) => ({
      id: item.id || index + 1,
      name: item.name,
      is_default: false
    })) as SchoolSubject[];
  } catch (err) {
    console.error("Error getting subjects from Supabase:", err);
    try {
      const raw = localStorage.getItem("school_subjects");
      return raw ? JSON.parse(raw) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  }
}

export async function addSubject(name: string): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getSubjects();
      const nextId = current.length > 0 ? Math.max(...current.map(s => s.id)) + 1 : 1;
      const updated = [
        ...current,
        { id: nextId, name: name.trim(), is_default: false }
      ];
      localStorage.setItem("school_subjects", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("subjects")
      .insert({ name: name.trim() });
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error adding subject to Supabase:", err);
    return false;
  }
}

export async function deleteSubject(id: number): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getSubjects();
      const updated = current.filter(s => s.id !== id);
      localStorage.setItem("school_subjects", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id);
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error deleting subject from Supabase:", err);
    return false;
  }
}

// ---------------------------------
// 5. Announcements & Notifications APIs (mapped to the custom announcements table)
// ---------------------------------
export async function getNotifications(): Promise<NotificationItem[]> {
  if (!supabase) {
    initLocalStorage();
    try {
      const raw = localStorage.getItem("school_notifications");
      return raw ? JSON.parse(raw) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  }
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return (data || []).map((item, index) => {
      // Determine semantic color/type category reflecting importance to present visually gorgeous UI
      let guessedType: "info" | "warning" | "success" | "danger" = "info";
      const txt = ((item.title || "") + " " + (item.content || "")).toLowerCase();
      if (txt.includes("عاجل") || txt.includes("هام") || txt.includes("مهم") || txt.includes("انتبه") || txt.includes("فرض") || txt.includes("امتحان")) {
        guessedType = "danger";
      } else if (txt.includes("تغيير") || txt.includes("حصص") || txt.includes("توقيت") || txt.includes("إعلان")) {
        guessedType = "warning";
      } else if (txt.includes("مبروك") || txt.includes("تتويج") || txt.includes("نجاح") || txt.includes("فوز")) {
        guessedType = "success";
      }
      return {
        id: item.id || index + 1,
        title: item.title || "",
        message: item.content || "",
        date: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        type: guessedType,
        subject: item.subject_name || ""
      } as NotificationItem;
    });
  } catch (err) {
    console.error("Error getting announcements from Supabase:", err);
    try {
      const raw = localStorage.getItem("school_notifications");
      return raw ? JSON.parse(raw) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  }
}

export async function addNotification(
  title: string, 
  message: string, 
  type: "warning" | "info" | "success" | "danger" = "info",
  subject?: string
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getNotifications();
      const nextId = current.length > 0 ? Math.max(...current.map(n => n.id)) + 1 : 1;
      const updated = [
        ...current,
        { 
          id: nextId, 
          title: title.trim(), 
          message: message.trim(), 
          date: today, 
          type, 
          subject: subject || "" 
        } as NotificationItem
      ];
      localStorage.setItem("school_notifications", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("announcements")
      .insert({
        title: title.trim(),
        content: message.trim(),
        subject_name: subject || ""
      });
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error adding announcement to Supabase:", err);
    return false;
  }
}

export async function deleteNotification(id: number): Promise<boolean> {
  if (!supabase) {
    initLocalStorage();
    try {
      const current = await getNotifications();
      const updated = current.filter(n => n.id !== id);
      localStorage.setItem("school_notifications", JSON.stringify(updated));
      notifyUpdate();
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);
    if (error) throw error;
    notifyUpdate();
    return true;
  } catch (err) {
    console.error("Error deleting announcement from Supabase:", err);
    return false;
  }
}
