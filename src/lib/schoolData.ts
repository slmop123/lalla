import { NewsItem, NotificationItem, TeacherItem } from "../types";

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

export function initSchoolData() {
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

// Support functions to allow real CRUD directly on localStorage
export function getTickerLocal(): string {
  initSchoolData();
  return localStorage.getItem("school_ticker") || defaultTicker;
}

export function setTickerLocal(message: string) {
  localStorage.setItem("school_ticker", message);
  window.dispatchEvent(new Event("school-data-updated"));
}

export function getNewsLocal(): NewsItem[] {
  initSchoolData();
  try {
    const raw = localStorage.getItem("school_news");
    return raw ? JSON.parse(raw) : defaultNews;
  } catch {
    return defaultNews;
  }
}

export function addNewsLocal(title: string, content: string): NewsItem[] {
  const current = getNewsLocal();
  const nextId = current.length > 0 ? Math.max(...current.map(n => n.id)) + 1 : 1;
  const today = new Date().toISOString().split("T")[0];
  const newItem: NewsItem = {
    id: nextId,
    title: title.trim(),
    content: content.trim(),
    date: today
  };
  const updated = [...current, newItem];
  localStorage.setItem("school_news", JSON.stringify(updated));
  window.dispatchEvent(new Event("school-data-updated"));
  return updated;
}

export function getNotificationsLocal(): NotificationItem[] {
  initSchoolData();
  try {
    const raw = localStorage.getItem("school_notifications");
    return raw ? JSON.parse(raw) : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

export function addNotificationLocal(title: string, message: string, type: "warning" | "info" | "success" | "danger"): NotificationItem[] {
  const current = getNotificationsLocal();
  const nextId = current.length > 0 ? Math.max(...current.map(n => n.id)) + 1 : 1;
  const today = new Date().toISOString().split("T")[0];
  const newItem: NotificationItem = {
    id: nextId,
    title: title.trim(),
    message: message.trim(),
    date: today,
    type
  };
  const updated = [...current, newItem];
  localStorage.setItem("school_notifications", JSON.stringify(updated));
  window.dispatchEvent(new Event("school-data-updated"));
  return updated;
}

export function deleteNotificationLocal(id: number): NotificationItem[] {
  const current = getNotificationsLocal();
  const updated = current.filter(n => n.id !== id);
  localStorage.setItem("school_notifications", JSON.stringify(updated));
  window.dispatchEvent(new Event("school-data-updated"));
  return updated;
}

export function getTeachersLocal(): TeacherItem[] {
  initSchoolData();
  try {
    const raw = localStorage.getItem("school_teachers");
    return raw ? JSON.parse(raw) : defaultTeachers;
  } catch {
    return defaultTeachers;
  }
}

export function addTeacherLocal(name: string, subject: string, desc: string): TeacherItem[] {
  const current = getTeachersLocal();
  const nextId = current.length > 0 ? Math.max(...current.map(t => t.id)) + 1 : 1;
  const newItem: TeacherItem = {
    id: nextId,
    name: name.trim(),
    subject: subject.trim(),
    desc: desc.trim()
  };
  const updated = [...current, newItem];
  localStorage.setItem("school_teachers", JSON.stringify(updated));
  window.dispatchEvent(new Event("school-data-updated"));
  return updated;
}

export function deleteTeacherLocal(id: number): TeacherItem[] {
  const current = getTeachersLocal();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem("school_teachers", JSON.stringify(updated));
  window.dispatchEvent(new Event("school-data-updated"));
  return updated;
}
