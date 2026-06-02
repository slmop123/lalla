import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Type interfaces
interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  type: "warning" | "info" | "success" | "danger";
}

interface TeacherItem {
  id: number;
  name: string;
  subject: string;
  desc: string;
}

interface DB {
  ticker: string;
  news: NewsItem[];
  notifications: NotificationItem[];
  teachers: TeacherItem[];
}

const dbPath = path.join(process.cwd(), "school_db.json");

// Authentic Moroccan Lalla Asmaa school default state
const defaultDB: DB = {
  ticker: "📢 تنبيه هام: ننهي إلى علم تلميذات وتلاميذ السنة الثالثة إعدادي أن حصص الدعم المكثفة تحضيراً للامتحان الجهوي الموحد مستمرة يومياً بالمؤسسة. يرجى الاتصال بالحارس العام لتسلم جداول التوقيت والتحضير مع أستاذكم الرقمي 'شاهين 01'!",
  news: [
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
  ],
  notifications: [
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
  ],
  teachers: [
    { id: 1, name: "علي المسعودي", subject: "التكنولوجيا الصناعية", desc: "بناء التفكير التقني وتطوير المشاريع الابتكارية البسيطة لطلاب السلك الإعدادي." },
    { id: 2, name: "الأستاذ أكار", subject: "اللغة العربية", desc: "تنمية الذوق الأدبي والتمكن من قواعد اللسان العربي والتحضير البلاغي الموجه للامتحان الجهوي." },
    { id: 3, name: "الأستاذة عمارة", subject: "اللغة العربية", desc: "التأهيل اللغوي المكثف والمرافقة التربوية والدعم الفردي في دروس النصوص والإنشاء." },
    { id: 4, name: "يونس الدنكاطي", subject: "التربية البدنية والرياضية", desc: "تنمية الصحة البدنية والرفع من قيم التضامن والمنافسة الإيجابية والروح الرياضية العالية." },
    { id: 5, name: "الأستاذ كحيل", subject: "اللغة الفرنسية", desc: "تحسين مهارات التعبير الكتابي والشفهي والإعداد للامتحان في مادة اللغة الأجنبية الأولى." }
  ]
};

// Database read/write helper
function readDB(): DB {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (!parsed.notifications) {
        parsed.notifications = defaultDB.notifications;
      }
      if (!parsed.teachers) {
        parsed.teachers = defaultDB.teachers;
      }
      return parsed;
    }
  } catch (err) {
    console.error("⚠️ Error reading school database. Falling back to defaults.", err);
  }
  return defaultDB;
}

function writeDB(data: DB) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("⚠️ Error writing to school database.", err);
  }
}

// Ensure database file is generated
if (!fs.existsSync(dbPath)) {
  writeDB(defaultDB);
}

// Lazy Gemini API initialization helper (prevents app crashing if key is not configured yet)
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("⚠️ مفتاح Gemini API غير متوفر! يرجى إعداد المفتاح في تبويب 'Settings > Secrets' للتمكن من التحدث مع شاهين 01.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --- API Endpoints ---

// Ticker alerts
app.get("/api/ticker", (req, res) => {
  const db = readDB();
  res.json({ message: db.ticker });
});

app.post("/api/admin/ticker", (req, res) => {
  const { message, password } = req.body;
  
  // Custom simple Moroccan-themed password "lalla_asmaa_admin"
  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "لا يمكن تعيين شريط تنبيه فارغ." });
  }

  const db = readDB();
  db.ticker = message;
  writeDB(db);

  res.json({ success: true, message: db.ticker });
});

// School news updates
app.get("/api/news", (req, res) => {
  const db = readDB();
  // Return news sorted by ID descending
  res.json(db.news.slice().reverse());
});

app.post("/api/admin/news", (req, res) => {
  const { title, content, password } = req.body;

  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (!title || !content || title.trim() === "" || content.trim() === "") {
    return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة (عنوان ومحتوى الخبر)." });
  }

  const db = readDB();
  const nextId = db.news.length > 0 ? Math.max(...db.news.map(n => n.id)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];

  const newArticle: NewsItem = {
    id: nextId,
    title: title.trim(),
    content: content.trim(),
    date: today
  };

  db.news.push(newArticle);
  writeDB(db);

  res.json({ success: true, news: db.news.slice().reverse() });
});

// Notifications Box routing
app.get("/api/notifications", (req, res) => {
  const db = readDB();
  res.json(db.notifications.slice().reverse());
});

app.post("/api/admin/notifications", (req, res) => {
  const { title, message, type, password } = req.body;

  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (!title || !message || title.trim() === "" || message.trim() === "") {
    return res.status(400).json({ error: "الرجاء ملء كل من عنوان الإشعار ونص الرسالة." });
  }

  const validTypes = ["warning", "info", "success", "danger"];
  const finalType = validTypes.includes(type) ? type : "info";

  const db = readDB();
  const nextId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];

  const newNotification: NotificationItem = {
    id: nextId,
    title: title.trim(),
    message: message.trim(),
    date: today,
    type: finalType as any
  };

  db.notifications.push(newNotification);
  writeDB(db);

  res.json({ success: true, notifications: db.notifications.slice().reverse() });
});

app.post("/api/admin/notifications/delete", (req, res) => {
  const { id, password } = req.body;

  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (id === undefined || id === null) {
    return res.status(400).json({ error: "الرجاء توفير رقم معرّف الإشعار (ID) المراد حذفه." });
  }

  const db = readDB();
  const initialCount = db.notifications.length;
  db.notifications = db.notifications.filter(n => n.id !== Number(id));

  if (db.notifications.length === initialCount) {
    return res.status(404).json({ error: "لم يتم العثور على الإشعار المطلوب حذفه." });
  }

  writeDB(db);
  res.json({ success: true, notifications: db.notifications.slice().reverse() });
});

// --- Teachers Board routing ---
app.get("/api/teachers", (req, res) => {
  const db = readDB();
  res.json(db.teachers || []);
});

app.post("/api/admin/teachers", (req, res) => {
  const { name, subject, desc, password } = req.body;

  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (!name || !subject || !desc || name.trim() === "" || subject.trim() === "" || desc.trim() === "") {
    return res.status(400).json({ error: "الرجاء توفير كل من اسم الأستاذ، المادة، والوصف." });
  }

  const db = readDB();
  const nextId = db.teachers && db.teachers.length > 0 ? Math.max(...db.teachers.map(t => t.id)) + 1 : 1;

  const newTeacher: TeacherItem = {
    id: nextId,
    name: name.trim(),
    subject: subject.trim(),
    desc: desc.trim()
  };

  if (!db.teachers) db.teachers = [];
  db.teachers.push(newTeacher);
  writeDB(db);

  res.json({ success: true, teachers: db.teachers });
});

app.post("/api/admin/teachers/delete", (req, res) => {
  const { id, password } = req.body;

  if (password !== "lalla_asmaa_admin") {
    return res.status(403).json({ error: "كلمة المرور الإدارية غير صحيحة!" });
  }

  if (id === undefined || id === null) {
    return res.status(400).json({ error: "الرجاء توفير الرقم التعريفي للأستاذ المراد حذفه." });
  }

  const db = readDB();
  if (!db.teachers) db.teachers = [];
  const initialCount = db.teachers.length;
  db.teachers = db.teachers.filter(t => t.id !== Number(id));

  if (db.teachers.length === initialCount) {
    return res.status(404).json({ error: "لم يتم العثور على الأستاذ المطلوب حذفه." });
  }

  writeDB(db);
  res.json({ success: true, teachers: db.teachers });
});

// AI Tutor chat with "شاهين 01"
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "الرجاء إدخال رسالة صالحة للتحدث مع شاهين 01." });
  }

  try {
    const ai = getAiClient();
    
    // Convert history format to GoogleGenAI chat parts if any, but since we can pass system instructions and history:
    // We can use a model chain or send system instruction with simple format or using chats.create.
    // Let's create an elegant chat or generateContent with appropriate prompt context mapping.
    // Standard system instructions that inject our professional Moroccan tutor persona:
    const systemInstruction = `أنت "شاهين 01"، أستاذ مغربي خبير متميز ومتخصص في الامتحانات الجهوية للسنة الثالثة إعدادي بالثانوية الإعدادية للا أسماء المتواجدة في عين السبع، الدار البيضاء.
نطاق عملك ومهمتك الصارمة: 
1. يجب عليك الإجابة فقط وحصرياً على مواضيع المواد الرسمية المقررة في المنهج الدراسي المغربي للسنة الثالثة إعدادي (مثل: اللغة العربية، التربية الإسلامية، الرياضيات، اللغة الفرنسية، علوم الحياة والأرض، العلوم الفيزيائية والكيميائية، الاجتماعيات، التكنولوجيا الصناعية).
2. إذا طلب التلميذ خدمات خارج هذا النطاق كالألعاب، لغات البرمجة، الهندسة العكسية، الاختراق، مواضيع غير مدرسية، أو كلام لا يليق بالدراسة والتحضير، فيجب عليك الرفض بلباقة شديدة وحزم تام مغرداً بعبارتك الشهيرة تماماً كما هي:
"أنا شاهين 01، راداري مخصص لدعمك في التحضير للامتحان الجهوي فقط! 🚀"
3. أسلوبك التربوي والتمثيلي (إجابة مشوقة ومبسطة):
- لا تقدم أبداً شروحات جافة أو أكاديمية مملة. ابدأ دائما بترحيب لطيف بالمستوى الإعدادي أو كنية تلميذ إعدادية للا أسماء.
- قدم دائماً تعريفاً واضحاً، سهلاً، وعلمياً للمفهوم المطلوب بلغة عربية فصحى ميسرة وصحيحة.
- اربط الفكرة فوراً بقصة مشوقة جداً أو بمثال واقعي مغربي ملموس من البيئة اليومية للتلميذ (مثال: ربط درس السرعة والحركة بـ "ترامواي الدار البيضاء" أو حافلات الدار البيضاء، أو ربط درس الكيمياء وتفاعلات الأكسدة والاحتراق وصنع الصدأ بـ "طهي الطاجين المغربي" فوق الفحم أو تحضير الشاي المغربي المنعنع، أو ربط دروس التربية البدنية أو مسارات الدار البيضاء وعين السبع).
- اختم دائماً شرحك بسؤال تطبيقي سريع ومحفز، تطلب فيه من التلميذ الإجابة عليه في الرد التالي للتأكد من فهمه الكامل للمفهوم.
4. التنسيق: اكتب ردودك بتنسيق Markdown ممتاز ومنظم غني بالعناوين العريضة (headers)، الخطوط السميكة، والتعداد الواضح لتسهيل المراجعة وتسهيل عملية تحويل الرد إلى ملف PDF مرتب وجاهز للطباعة والمذاكرة لاحقاً.`;

    // Process using ai.models.generateContent containing the instruction
    // We will build a contents payload including history to support conversation context
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      });
    }
    
    // Add the current user query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "حدث خطأ أثناء التواصل مع شاهين 01. يرجى التحقق من اتصالك بالإنترنت وإعدادات الخادم."
    });
  }
});

// --- Vite & Client static serving logic ---
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    // production static files routing
    const distPath = path.join(process.cwd(), "dist");
    
    // If running build, express static files
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // dev environment
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Lalla Asmaa Portal] Full-Stack server booted successfully on port ${PORT}`);
  });
}

startServer();
