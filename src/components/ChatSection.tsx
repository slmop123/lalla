import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Send, 
  Sparkles, 
  FileDown, 
  HelpCircle, 
  User, 
  AlertTriangle,
  RotateCcw,
  Loader2,
  GraduationCap,
  BookOpen,
  Atom,
  Calculator,
  Compass,
  Globe,
  Sprout,
  Library,
  ChevronLeft,
  FileCheck2,
  HelpCircle as HelpIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubjectMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  regionalFocus: string[];
  tips: string;
}

export default function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `أهلاً بك يا بطل ويا بطلة الثانوية الإعدادية للا أسماء بعين السبع! 👋\n\nأنا **شاهين 01**، أستاذك وصديقك الرقمي المخصص لمساعدتك في الاستعداد ومراجعة دروس **الامتحان الجهوي الموحد للسنة الثالثة إعدادي**.\n\nيمكننا تدارس أي مادة مقررة (الفيزياء، الرياضيات، التربية الإسلامية، العربي، الفرنسي، علوم الحياة والأرض، الاجتماعيات، التكنولوجيا).\n\n**لقد قمت بتحضير أمثلة مغربية مشوقة وسهلة الفهم لك!** اسألني أي سؤال في منهجك الإعدادي وسأبسطه لك في حكاية.\n\n_ملاحظة: يمكنك في أي وقت تحميل الشرح الأخير كملف PDF جاهز لطباعته والمراجعة منه لاحقاً!_`,
      timestamp: new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<string>("all");
  
  // PDF Export visual state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>("");

  // Replaces unsafe window.confirm with slick in-app states
  const [confirmResetState, setConfirmResetState] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Subject Modes Configuration
  const subjectModes: SubjectMode[] = [
    {
      id: "all",
      name: "الكل 🌟",
      icon: <Library className="h-4 w-4" />,
      color: "border-slate-300 text-slate-700 bg-slate-50",
      placeholder: "اكتب سؤالك في أي منهج أو مادة بالسلك الثالث إعدادي...",
      regionalFocus: [
        "دروس الحركة والسرعة في الفيزياء الكيمياء.",
        "علاقة الإيمان بالغيب وقرآن سورة الحديد في الإسلاميات.",
        "تمثيل الدوائل وإحصاء النسب في الرياضيات إعدادي.",
        "درس تفاعل الأكسدة وميكانيزمات صدأ المعادن."
      ],
      tips: "استخدم الأزرار الجانبية لتنشيط وضع المراجعة التخصصية وتركيز ذكاء شاهين 01 على منهج مادة وحيدة لتحقيق الكفاءة القصوى."
    },
    {
      id: "math",
      name: "الرياضيات 📐",
      icon: <Calculator className="h-4 w-4" />,
      color: "border-royal-blue text-royal-blue bg-blue-50/40",
      placeholder: "مثال: اشرح لي مبرهنة فيتاغورس أو الدوال الخطية وبسطها لي بالأمثلة...",
      regionalFocus: [
        "مبرهنتي مجهري فيتاغورس وطاليس المباشرة والعكسية.",
        "المعادلات والمتراجحات والنظمات من الدرجة الأولى بمجهول واحد.",
        "مبادئ الهندسة الفضائية وحساب الحجوم.",
        "الإحصاء وتمثيل الدوال الخطية والتآلفية."
      ],
      tips: "ركز على مراجعة طريقة صياغة النظمات الرياضية وحلها مبيانياً وجبرياً، واطلب من شاهين تمارين تطبيقية لتدارسها معاً."
    },
    {
      id: "physics",
      name: "الفيزياء والكيمياء 🧪",
      icon: <Atom className="h-4 w-4" />,
      color: "border-amber-400 text-amber-700 bg-amber-50/40",
      placeholder: "مثال: لخص لي دروس الميكانيك وعلاقة الوزن بالكتلة وصيغها الرياضية...",
      regionalFocus: [
        "الحركة والسرعة وتحديد طبيعة مسار الأجسام.",
        "تأثير القوى وشرط توازن جسم خاضع لقوتين.",
        "أكسدة الفلزات في الهواء الرطب وصدأ الحديد.",
        "مفهوم المحاليل الحمضية والقاعدية وكواشف درجة الـ pH."
      ],
      tips: "الامتحان الجهوي يركز بقوة على تجارب الكشف عن الأيونات وحساب السرعة المتوسطة وتأثير القوة المطبقة على سرعة الحركة."
    },
    {
      id: "biology",
      name: "علوم الحياة والأرض 🌿",
      icon: <Sprout className="h-4 w-4" />,
      color: "border-emerald-400 text-emerald-700 bg-emerald-50/40",
      placeholder: "مثال: بسط لي وظائف الهضم والامتصاص المعوي وآليات المناعة الطبيعية...",
      regionalFocus: [
        "الجهاز الهضمي والامتصاص ومخاطر سوء التغذية.",
        "آليات التنفس والدوران الدموي والتبادلات الغازية.",
        "عمل الجهاز العصبي والجهاز العضلي والوقاية.",
        "آليات الاستجابة المناعية الطبيعية والمكتسبة."
      ],
      tips: "تأكد من إتقان أوساط الدفاع المناعي (البلعمة، إنتاج الكريات وتأثير مضادات الأجسام). شاهين يمكنه رسم خرائط المفاهيم كتابياً."
    },
    {
      id: "social",
      name: "الاجتماعيات 🌍",
      icon: <Globe className="h-4 w-4" />,
      color: "border-teal-400 text-teal-700 bg-teal-50/40",
      placeholder: "مثال: لخص لي ظاهرة الأنظمة الديكتاتورية أو معركة بناء الدولة المغربية الحديثة...",
      regionalFocus: [
        "تاريخ المغرب والكفاح من أجل الاستقلال وإتمام الوحدة الترابية.",
        "تاريخ بروز الحرب العالمية الثانية والنازية.",
        "قضايا جغرافية هامة كقوة الولايات المتحدة والصين.",
        "المواطنة والحفاظ على الموارد والترابط التنموي."
      ],
      tips: "دائماً ما يتضمن الامتحان الجهوي للاجتماعيات تحليل وثيقة تاريخية أو جغرافية أو كتابة مقال منظم بالمقدمة والمنهج والوصيف."
    },
    {
      id: "arabic",
      name: "اللغة العربية 📝",
      icon: <BookOpen className="h-4 w-4" />,
      color: "border-orange-400 text-orange-700 bg-orange-50/40",
      placeholder: "مثال: اشرح لي درس التعجب والمدح والذم مع أمثلة وسهلة الأسلوب...",
      regionalFocus: [
        "الدرس اللغوي: الإضافة، الممنوع من الصرف، التعجب.",
        "أساليب الاختصاص، الاستفهام، والمدح والذم.",
        "مكون التعبير والإنشاء: تخيل حكاية عجيبة أو سيرة ذاتية.",
        "فهم المقروء وتحليل الفكرة المحورية للنص."
      ],
      tips: "تدرب مع شاهين 01 على تشكيل وضبط أواخر الكلمات بالدرس اللغوي لكي تحصل على النقطة الكاملة بالإعراب المفصل."
    },
    {
      id: "islamic",
      name: "التربية الإسلامية 🕌",
      icon: <Compass className="h-4 w-4" />,
      color: "border-indigo-400 text-indigo-700 bg-indigo-50/40",
      placeholder: "مثال: لخص لي قيم الرعاية والمسؤولية واستحضار الآيات من سورة الحديد...",
      regionalFocus: [
        "سورة الحديد: قواعد التجويد، التدبر والعبر العقائدية.",
        "مدخل التزكية: عمارة الأرض، أثر الغيب في الإيمان.",
        "مدخل الاقتداء والتربية: الرسول عليه السلام ومقاصد التربية.",
        "مدخل القسط والحكمة: حق الله، وحق النفس والأسرة والمجتمع."
      ],
      tips: "احرص على ربط الإجابات بالنصوص الشرعية والاستشهاد من الآيات المقررة بسورة الحديد، شاهين سيساعدك على حفظها وتصحيح كتابتك."
    }
  ];

  const activeModeDetails = subjectModes.find(m => m.id === activeSubject) || subjectModes[0];

  // Standard Moroccan educational helper prompts
  const samplePrompts = [
    { title: "🚋 حركة ترامواي البيضاء", query: "اشرح لي درس الحركة والسرعة المتوسطة وقوانينها الرياضية بربطها بحركة ترامواي الدار البيضاء بأسلوب ممتع ومشوق." },
    { title: "🍲 أكسدة الطاجين المغربي", query: "لخص لي درس تفاعلات أكسدة الفلزات (الحديد والألومنيوم في الهواء الرطب) وربطها بعملية طهي الطاجين المغربي لسهولة فهمها." },
    { title: "📝 درس الإضافة والإعراب", query: "اشرح لي قواعد درس الإضافة وصيغ الممنوع من الصرف مع تطبيقات عملية سهلة للتحضير للامتحان الموحد." },
    { title: "🕌 معجزات سورة الحديد", query: "لخص لي محاور الإيمان والغيب والمسؤولية ورعاية الأسرة في مادة التربية الإسلامية مع استحضار آيات من سورة الحديد." }
  ];

  // Quick helper to convert flat text to formatted HTML preserving basic bold markers and bullets
  const renderFormattedText = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-royal-blue mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-royal-blue mt-5 mb-2 border-r-3 border-amber-400 pr-2">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold text-royal-blue mt-6 mb-3 border-b border-amber-250 pb-1">$1</h1>');

    // Bold text (**word**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 bg-amber-50 px-1 rounded">$1</strong>');
    
    // Bullet lists (* word or - word)
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="mr-4 list-disc text-xs sm:text-sm text-slate-700/95 mb-1">$1</li>');

    // Numbered lists
    html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="mr-4 list-decimal text-xs sm:text-sm text-slate-700/95 mb-1">$1</li>');

    // Space breaks and paragraphs
    html = html.replace(/\n text-right/g, "");
    html = html.replace(/\n text-left/g, "");
    html = html.replace(/\n text-center/g, "");
    html = html.replace(/\n+/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: html }} className="markdown-body space-y-1.5 focus:outline-none" />;
  };

  const handleSend = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setInput("");
    
    // Build context prefix if specific subject active
    let contextPrefix = "";
    if (activeSubject !== "all") {
      const mode = subjectModes.find(m => m.id === activeSubject);
      if (mode) {
        contextPrefix = `[في هذه المحادثة، نركز حالياً بالتحديد على حصة مراجعة مادة: ${mode.name} للامتحان الجهوي الموحد لجهة الدار البيضاء سطات] `;
      }
    }

    const finalQuery = contextPrefix ? `${contextPrefix}${query}` : query;

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error(
          "لم يتم العثور على مفتاح الـ API لـ Gemini. يرجى ضبط المتغير VITE_GEMINI_API_KEY في قسم الإعدادات (Settings > Secrets) برمز المنصة ومن ثم المحاولة مجدداً."
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
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

      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction,
      });

      const contentsPayload: any[] = [];
      const historyContext = messages.filter(m => m.id !== "welcome-msg" && !m.isError).slice(-6);
      
      historyContext.forEach(m => {
        contentsPayload.push({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        });
      });

      contentsPayload.push({
        role: "user",
        parts: [{ text: finalQuery }]
      });

      const response = await model.generateContent({
        contents: contentsPayload,
        generationConfig: {
          temperature: 0.7,
        }
      });

      let replyText = "";
      if (response && response.response) {
        if (typeof response.response.text === "function") {
          replyText = response.response.text();
        } else {
          replyText = (response.response as any).text || "";
        }
      }

      if (!replyText) {
        throw new Error("لم تتلقى المنصة رداً صالحاً من نموذج الذكاء الاصطناعي.");
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      const errMsg = err.message || "حدث خطأ غير متوقع أثناء إرسال استفسارك.";
      
      const assistantErrorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ نعتذر منك يا بطل الإعدادية، واجهنا صعوبة في معالجة طلبك.\n\n**السبب المحتمل:** ${errMsg}\n\nيرجى المحاولة مجدداً أو استشارة الدعم الإداري.`,
        timestamp: new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      
      setMessages(prev => [...prev, assistantErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (!confirmResetState) {
      setConfirmResetState(true);
      return;
    }

    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: `أهلاً بك يا بطل ويا بطلة الثانوية الإعدادية للا أسماء بعين السبع! 👋\n\nأنا **شاهين 01**، أستاذك وصديقك الرقمي المخصص لمساعدتك في الاستعداد ومراجعة دروس **الامتحان الجهوي الموحد للسنة الثالثة إعدادي**.\n\nيمكننا تدارس أي مادة مقررة (الفيزياء، الرياضيات، التربية الإسلامية، العربي، الفرنسي، علوم الحياة والأرض، الاجتماعيات، التكنولوجيا).\n\nاسألني أي سؤال في منهجك الإعدادي وسأبسطه لك في حكاية.\n\n_ملاحظة: يمكنك في أي وقت تحميل الشرح الأخير كملف PDF جاهز لطباعته والمراجعة منه لاحقاً!_`,
        timestamp: new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setConfirmResetState(false);
  };

  const handleExportPDF = () => {
    setExportError("");
    const assistantMessages = messages.filter(m => m.role === "assistant" && !m.isError);
    if (assistantMessages.length === 0) {
      setExportError("لا يتوفر أي شرح معالج من شاهين 01 لتحميله حالياً!");
      return;
    }

    setIsExporting(true);
    const lastResponse = assistantMessages[assistantMessages.length - 1];

    const printContainer = document.createElement("div");
    printContainer.style.fontFamily = "'Cairo', sans-serif";
    printContainer.style.direction = "rtl";
    printContainer.style.padding = "25px";
    printContainer.style.backgroundColor = "#ffffff";
    printContainer.style.color = "#1e293b";

    const formattedContentHTML = lastResponse.content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^### (.*?)$/gm, '<h3 style="color: #0f4c81; font-weight: bold; border-right: 3px solid #c5a059; padding-right: 8px; margin-top: 15px; margin-bottom: 8px; font-size: 15px;">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 style="color: #0f4c81; font-weight: bold; border-right: 4px solid #0f4c81; padding-right: 10px; margin-top: 20px; margin-bottom: 10px; font-size: 18px;">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 style="color: #0f4c81; font-weight: bold; text-align: center; margin-top: 25px; margin-bottom: 12px; font-size: 21px;">$1</h1>')
      .replace(/^\s*[-*]\s+(.*?)$/gm, '<li style="margin-right: 15px; margin-bottom: 5px; list-style-type: square; font-size: 13px;">$1</li>')
      .replace(/^\s*\d+\.\s+(.*?)$/gm, '<li style="margin-right: 15px; margin-bottom: 5px; list-style-type: decimal; font-size: 13px;">$1</li>')
      .replace(/\n/g, "<br/>");

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #0f4c81; padding-bottom: 15px; margin-bottom: 25px; font-size: 11px; text-align: right; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: bold; color: #0f4c81;">المملكة المغربية</div>
          <div>وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
          <div>أكاديمية الدار البيضاء سطات - مديرية عين السبع الحي المحمدي</div>
          <div style="font-weight: bold;">الثانوية الإعدادية للا أسماء</div>
        </div>
        <div style="border: 2px solid #c5a059; padding: 6px 12px; border-radius: 6px; background-color: #faf7f2; text-align: center;">
          <div style="font-weight: bold; color: #0f4c81; font-size: 13px;">مذكرة التلميذ الرقمية</div>
          <div style="font-size: 10px; color: #a63f28;">التحضير للامتحان الجهوي الموحد</div>
        </div>
      </div>

      <div style="background-color: #0f4c81; color: #ffffff; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 16px;">
        📄 ملخص شرح وتوجيه الأستاذ شاهين 01 بالثانوية
      </div>

      <div style="font-size: 13.5px; line-height: 1.8; text-align: justify; color: #2d3748; padding-right: 5px;">
        ${formattedContentHTML}
      </div>

      <div style="margin-top: 40px; padding-top: 15px; border-top: 1px dashed #c5a059; text-align: center; font-size: 11px; color: #718096; display: flex; justify-content: space-between; align-items: center;">
        <div>التاريخ: ${new Date().toLocaleDateString("ar-MA")} - ${new Date().toLocaleTimeString("ar-MA", { hour: '2-digit', minute: '2-digit' })}</div>
        <div style="font-weight: bold; color: #0f4c81;">الثانوية الإعدادية للا أسماء - عين السبع، الدار البيضاء</div>
        <div style="color: #a63f28; font-weight: bold;">تم التوليد بنجاح عبر شاهين 01 ✨</div>
      </div>
    `;

    document.body.appendChild(printContainer);

    const options = {
      margin: [12, 12, 12, 12],
      filename: `LallaAsmaa_Shaheen01_${activeSubject}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if ((window as any).html2pdf) {
      (window as any).html2pdf().from(printContainer).set(options).save().then(() => {
        document.body.removeChild(printContainer);
        setIsExporting(false);
      }).catch((err: any) => {
        console.error(err);
        setExportError("تعذر تجميع ملف PDF. يرجى إعادة المحاولة.");
        setIsExporting(false);
      });
    } else {
      setExportError("مكتبة pdf غير متوفرة محلياً حالياً. يرجى تحديث الصفحة.");
      document.body.removeChild(printContainer);
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[580px]" id="chat-system-workstation">
      
      {/* Sidebar tips & cues */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Dynamic Theme indicator helper */}
        <div className="bg-white rounded-xl border border-amber-200/40 p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
            <GraduationCap className="h-5 w-5 text-moroccan-gold" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 font-serif">مرشد المذاكرة المخصص</h4>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed font-sans space-y-2">
            <p>
              لقد دمجنا نمط مراجعة عالي الإنتاجية لتوجيه شاهين 01 في مادة: 
            </p>
            <div className={`p-2.5 rounded-lg border text-center font-bold text-xs flex items-center justify-center gap-2 ${activeModeDetails.color}`}>
              {activeModeDetails.icon}
              <span>{activeModeDetails.name}</span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-100">
            <h5 className="font-bold text-[10px] text-slate-700 mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-moroccan-gold" />
              <span>أهم نقاط التركيز الجهوي:</span>
            </h5>
            <ul className="text-[10px] text-slate-500 leading-relaxed space-y-1 mr-3 list-disc">
              {activeModeDetails.regionalFocus.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="text-[10px] text-slate-400 bg-amber-50/40 p-2.5 rounded border border-amber-250/20 leading-relaxed">
            <strong>💡 نصيحة للتحضير الفعال:</strong> {activeModeDetails.tips}
          </div>
        </div>

        {/* Dynamic Suggested Prep Questions list */}
        <div className="bg-white rounded-xl border border-amber-200/30 p-4 shadow-xs space-y-3">
          <h4 className="font-bold text-xs text-slate-800 font-serif flex items-center gap-1.5 border-b border-dashed border-slate-100 pb-1.5">
            <FileCheck2 className="h-4 w-4 text-royal-blue" />
            <span>نصوص حية للمراجعة السريعة:</span>
          </h4>
          <div className="flex flex-col gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                id={`sample-prompt-btn-${idx}`}
                onClick={() => setInput(p.query)}
                className="w-full text-right p-2.5 rounded-lg text-slate-705 bg-slate-50 hover:bg-amber-50/30 border border-slate-200 text-[10.5px] hover:border-moroccan-gold hover:text-royal-blue font-medium transition duration-200 cursor-pointer flex justify-between items-center group"
              >
                <span>{p.title}</span>
                <ChevronLeft className="h-3 w-3 text-slate-300 group-hover:text-moroccan-gold transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main interactive Chat Box */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-xl border border-amber-200/50 shadow-sm overflow-hidden h-[620px]">
        
        {/* Subject pills toolbar mode */}
        <div className="bg-slate-100 border-b border-amber-200/20 px-3.5 py-2 overflow-x-auto scrollbar-none flex gap-2 shrink-0 items-center">
          <span className="text-[10px] font-bold text-slate-400 font-sans shrink-0 ml-1">المادة النشطة:</span>
          {subjectModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveSubject(mode.id);
                setConfirmResetState(false);
              }}
              className={`px-3 py-1.5 text-[10.5px] font-semibold border rounded-full shrink-0 transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeSubject === mode.id
                  ? "bg-royal-blue text-white shadow-xs border-royal-blue"
                  : "bg-white text-slate-600 border-slate-200 hover:border-moroccan-gold hover:text-royal-blue"
              }`}
            >
              {mode.icon}
              <span>{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Chat box head controls */}
        <div className="bg-slate-50 border-b border-amber-200/30 px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-royal-blue text-white flex items-center justify-center font-bold text-sm tracking-widest relative z-10 shadow-sm">
                ش
              </div>
              <span className="absolute bottom-[-1px] left-[-0.5px] block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white z-20"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-bold text-sm text-slate-900 font-serif">الاستاذ والرفيق التربوي "شاهين 01"</span>
                <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">وضع مباشر</span>
              </div>
              <span className="text-[9.5px] text-slate-400 font-medium font-sans">تطوير مستمر استعداداً للامتحان الجهوي الموحد لجهة البيضاء-سطات</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF button */}
            <button
              id="download-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`px-3 py-1.5 bg-royal-blue hover:bg-royal-hover text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-transparent ${
                isExporting ? "opacity-60 cursor-wait" : ""
              }`}
              title="تنزيل الشرح الأخير كملف PDF"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">{isExporting ? "جاري تجميع الملف..." : "تحميل التلخيص كملف PDF مجهَّز"}</span>
            </button>

            {/* Clear conversation button without alerts */}
            <button
              id="reset-chat-btn"
              onClick={handleResetChat}
              className={`p-1.5 px-2.5 rounded-lg border text-xs transition duration-200 cursor-pointer flex items-center gap-1 font-bold ${
                confirmResetState 
                  ? "bg-red-650 text-white border-red-750 animate-pulse" 
                  : "border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-red-500"
              }`}
              title={confirmResetState ? "انقر مجدداً للتأكيد النهائي" : "تصفية وإعادة تعيين الحوار"}
            >
              <RotateCcw className="h-4 w-4" />
              {confirmResetState && <span className="text-[9px]">تأكيد إعادة الضبط؟</span>}
            </button>
          </div>
        </div>

        {/* Message Log viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-[#faf9f6]/30 to-white space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-full ${m.role === "user" ? "justify-start flex-row-reverse" : "justify-start"}`}
              >
                {/* Chat Avatar */}
                <div className={`w-8.5 h-8.5 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                  m.role === "user" 
                    ? "bg-[#0f4c81]/10 text-royal-blue border border-royal-blue/20" 
                    : m.isError 
                      ? "bg-red-50 text-red-650 border border-red-200" 
                      : "bg-[#0f4c81] text-white border border-[#0f4c81]/35"
                }`}>
                  {m.role === "user" ? <User className="h-3.5 w-3.5" /> : "شاهين"}
                </div>

                {/* Bubble box */}
                <div className={`rounded-xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed max-w-[80%] border shadow-xs ${
                  m.role === "user"
                    ? "bg-[#0f4c81]/5 text-slate-800 border-royal-blue/10 rounded-tr-none font-medium"
                    : m.isError
                      ? "bg-red-50 text-red-800 border-red-200"
                      : "bg-[#fdfbf7] text-slate-800 border-amber-250/30 rounded-tl-none font-serif text-right"
                }`}>
                  <div className="space-y-1.5">
                    {m.role === "assistant" ? renderFormattedText(m.content) : <p className="whitespace-pre-wrap font-sans leading-relaxed">{m.content}</p>}
                  </div>
                  <div className="text-[9px] text-slate-450 text-left mt-2.5 font-mono">
                    {m.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Prompt Loading bubble */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8.5 h-8.5 rounded-full shrink-0 flex items-center justify-center font-bold text-xs bg-royal-blue text-white shadow-xs">
                شاهين
              </div>
              <div className="rounded-xl px-4 py-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-[80%] flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-royal-blue" />
                <span className="font-sans font-medium">جاري معالجة الشرح وصياغة استشهاد مغربي ممتع، يرجى الانتظار للحظة...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Footer input form controller */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <form
            id="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <input
              id="chat-text-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setConfirmResetState(false);
              }}
              disabled={isLoading}
              placeholder={activeModeDetails.placeholder}
              className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-450 text-xs sm:text-sm focus:outline-none focus:border-royal-blue font-sans shadow-inner transition-colors duration-200"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-5 py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition duration-200 cursor-pointer ${
                isLoading || !input.trim() 
                  ? "bg-slate-350 cursor-not-allowed text-slate-500" 
                  : "bg-royal-blue hover:bg-royal-hover shadow-sm"
              }`}
            >
              <span className="font-sans font-extrabold text-xs">إرسال</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          
          <div className="mt-2 text-[9.5px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            <span>بوابة للا أسماء للتعليم الذكي — يعالج شاهين 01 المادة للامتحان الجهوي بدعم من نموذج الذكاء الاصطناعي الخبير.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
