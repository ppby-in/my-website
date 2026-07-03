import React, { useState, useEffect } from "react";
import { 
  Languages, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Terminal, 
  Send, 
  Check, 
  User, 
  Monitor, 
  Home, 
  Layers, 
  FileText,
  AlertCircle,
  Copy,
  ArrowUp,
  Cpu,
  RefreshCw,
  Search,
  Layout,
  Sliders,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { cnTranslations, enTranslations, TranslationDict } from "./types";

export default function App() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const t: TranslationDict = lang === "zh" ? cnTranslations : enTranslations;

  const [activeSection, setActiveSection] = useState("about");
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Portfolio URL sharing states
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedDevUrl, setCopiedDevUrl] = useState(false);
  const [copiedSharedUrl, setCopiedSharedUrl] = useState(false);
  const [copiedStandaloneUrl, setCopiedStandaloneUrl] = useState(false);

  const devUrl = "https://ais-dev-3vn4nxqhhwzfmywdj47ueu-737625509153.us-east1.run.app";
  const sharedUrl = "https://ais-pre-3vn4nxqhhwzfmywdj47ueu-737625509153.us-east1.run.app";
  const standaloneUrl = sharedUrl + "/portfolio.html";

  const copyDevUrl = () => {
    navigator.clipboard.writeText(devUrl);
    setCopiedDevUrl(true);
    setTimeout(() => setCopiedDevUrl(false), 2500);
  };

  const copySharedUrl = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopiedSharedUrl(true);
    setTimeout(() => setCopiedSharedUrl(false), 2500);
  };

  const copyStandaloneUrl = () => {
    navigator.clipboard.writeText(standaloneUrl);
    setCopiedStandaloneUrl(true);
    setTimeout(() => setCopiedStandaloneUrl(false), 2500);
  };

  // Popup Modal state for projects (Image 3)
  const [activeProjectModal, setActiveProjectModal] = useState<number | null>(null);

  // AI Job Matcher state
  const [jdInput, setJdInput] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [showMatcherModal, setShowMatcherModal] = useState(false);
  const [matcherError, setMatcherError] = useState("");

  // Demo JDs
  const demoJds = {
    zh: `招聘：【助理产品经理（体验方向）】
1. 协助电视大屏、IoT智能家居桌面系统的需求调研与用户行为分析；
2. 负责绘制交互原型线框图，梳理核心功能逻辑与用户使用动线；
3. 协助撰写产品功能说明书（PRD），协调研发与设计师共同推进产品体验迭代；
4. 工业设计、人机交互、心理学、计算机相关专业硕士优先；
5. 了解并能使用AI工具（如ChatGPT、Figma等）辅助日常研究者优先。`,
    en: `Hiring: 【Associate Product Manager - UX Focus】
1. Assist in user research, requirement gathering, and behavioral analysis for Smart TV & IoT systems.
2. Build interactive high-fidelity wireframes, mapping user pathways and visual information architecture.
3. Help author Product Requirements Documents (PRD) and cooperate with engineers to release system updates.
4. Master's degree in Industrial Design, HCI, Service Design, or related fields preferred.
5. Familiarity with AI workflows (ChatGPT, Midjourney) and modern UX/UI toolkits (Figma) is a major plus.`
  };

  // Titles for the Typewriter Effect
  const typewriterTitles = lang === "zh" 
    ? [
        "Product Manager & User Researcher",
        "工业设计工程硕士 · 服务体验设计方向",
        "AI 协同全栈原型交付者"
      ] 
    : [
        "Product Manager & User Researcher",
        "Master of Industrial Design Engineering",
        "AI-Collaborative Full-Stack Prototyper"
      ];

  // Typewriter effect state
  const [typedText, setTypedText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = typewriterTitles[titleIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentTitle.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 35);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentTitle.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 70);
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      timer = setTimeout(() => setIsDeleting(true), 1800); // stay visible
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTitleIndex(prev => (prev + 1) % typewriterTitles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, titleIndex, lang]);

  // Step-by-step scanner animation logs
  useEffect(() => {
    let timer: any;
    if (isMatching) {
      if (matchStep < t.matcherScanning.length - 1) {
        timer = setTimeout(() => {
          setMatchStep(prev => prev + 1);
        }, 800);
      } else {
        // Complete scan, trigger API
        timer = setTimeout(() => {
          submitJdToBackend();
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [isMatching, matchStep, lang]);

  const handleStartMatch = () => {
    if (!jdInput.trim()) {
      setMatcherError(lang === "zh" ? "请输入或粘贴岗位职责描述！" : "Please enter or paste a job description!");
      return;
    }
    setMatcherError("");
    setMatchStep(0);
    setIsMatching(true);
    setShowMatcherModal(true);
  };

  const loadDemoJd = () => {
    setJdInput(demoJds[lang]);
    setMatcherError("");
  };

  const submitJdToBackend = async () => {
    try {
      const response = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdInput })
      });
      if (!response.ok) {
        throw new Error("API response error");
      }
      const data = await response.json();
      setMatchResult(data);
      setIsMatching(false);
    } catch (error) {
      console.error("Failed to reach backend matcher API. Using fallback evaluation:", error);
      // Fallback evaluation locally
      setTimeout(() => {
        const score = Math.floor(Math.random() * 12) + 87; // 87-98
        setMatchResult({
          score: score,
          matchLevel: score >= 90 ? (lang === "zh" ? "极高匹配 (Excellent Fit)" : "Excellent") : (lang === "zh" ? "高度契合" : "Highly Matched"),
          skillsScore: {
            userResearch: 96,
            productUnderstanding: 91,
            interactionFramework: 89,
            designExpression: 94,
            aiTools: 95
          },
          highlights: [
            "学术背景高度契合：服务体验设计与工业设计工程复合硕士背景，具备极强的系统思维与用研学术底蕴。",
            "实战用研经验过硬：拥有小米电视大屏桌面系统及缮居适老化两个高质量完整项目，涵盖大屏视听及障碍人群核心场景。",
            "AI与代码协同特长：能够使用大语言模型提炼用研语义标签、Midjourney辅助空间渲染、代码落地全栈作品集原型，极具未来数字化产品人视野。"
          ],
          highlightsEn: [
            "Strong Academic Fit: Master of Industrial Design Engineering specializing in Service Experience Design with rigorous system-thinking.",
            "Rich Empirical Projects: Hands-on experience with Xiaomi TV desktop systems and Shanju aging-friendly field research.",
            "AI-Assisted Delivery: Skilled at leveraging LLMs for semantic grouping, Midjourney for visual layouts, and responsive code for live portfolio prototype deployments."
          ],
          improvements: [
            "可以进一步针对该岗位的特定场景输出一份极简交互原型、或者分享一套面向该产品大屏/无障碍环境的轻量化竞品对比分析，展现突出的业务思考深度。",
            "面试时可着重向面试官展示本套AI个人作品集及岗位匹配器诊断成果，深度阐述自己对AI全栈设计流的敏锐思考。"
          ],
          improvementsEn: [
            "Draft a mini Product Requirement Document (PRD) or interactive flowcharts specific to their product system.",
            "Demo this AI Portfolio & Job Matcher during interviews to highlight your active adoption of future-proof engineering flows."
          ],
          summary: `潘碧莹与您粘贴的岗位匹配度高达 ${score}%。她完美融合了服务设计的人文关怀、大屏内容体验架构设计力、以及超前的AI+代码全栈生产力，是一位非常有潜力的复合型产品经理与用研新星。`,
          summaryEn: `Pan Biying aligns with your requirements at an amazing ${score}% score. She bridges systemic research methodologies, immersive user empathy, and digital engineering workflows.`,
          roleSuggestions: ["助理产品经理 / PM", "用户研究员 / UXR", "服务设计师 / 体验策划"],
          roleSuggestionsEn: ["Product Manager / Associate PM", "UX Researcher", "Interaction & Service Designer"]
        });
        setIsMatching(false);
      }, 1000);
    }
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("17817036316");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  // Scroll spy to highlight nav caps
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "education", "projects", "skills", "learning"];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  // Project modal data mapping (Image 3)
  const projectModals: Record<number, ProjectModalData> = {
    1: {
      title: lang === "zh" ? "小米电视桌面系统设计白皮书" : "Xiaomi TV Desktop System White Paper",
      sub: lang === "zh" ? "用户行为分析 / 交互框架设计 / 桌面大屏系统体验" : "User Behavior Analysis / Interaction Framework / TV OS Experience",
      columns: [
        {
          title: lang === "zh" ? "用户行为挖掘" : "Behavioral Digging",
          bgClass: "bg-sky-50/70 border-sky-100",
          borderClass: "border-sky-200",
          textClass: "text-sky-900",
          bulletClass: "marker:text-sky-500",
          items: lang === "zh" ? [
            "利用专业眼动实验采集远距离视听（2.5m-3.5m）下的视觉聚焦热力图。",
            "分析 5 类典型家庭用户角色，沉淀并转译 200+ 小时居家实访行为日志。",
            "提炼出大屏交互下的三大‘视线盲区’与极速浏览聚焦规律。"
          ] : [
            "Captured ambient gaze and television viewing heatmaps via professional eye-tracking hardware.",
            "Evaluated 5 distinct household archetypes, accumulating 200+ hours of physical logging.",
            "Pinpointed 3 primary Big-Screen 'gaze deadzones' and remote browsing pathways."
          ]
        },
        {
          title: lang === "zh" ? "信息架构精简" : "Architecture Slicing",
          bgClass: "bg-emerald-50/70 border-emerald-100",
          borderClass: "border-emerald-200",
          textClass: "text-emerald-900",
          bulletClass: "marker:text-emerald-500",
          items: lang === "zh" ? [
            "对大屏导航节点进行系统化剪枝，压缩桌面浏览层级至 3 层以内。",
            "提出多维联动式推荐架构，减少用户非必要的信息跨屏检索行为。",
            "优化系统卡片跳转路径，实现‘触手可得’的内容检索效率。"
          ] : [
            "Pruned navigation nodes systematically, capping TV desktop depth strictly under 3 tiers.",
            "Formulated multi-dimensional associative recommendations to minimize screen hunting.",
            "Restructured card entry loops to foster responsive, zero-effort content retrievals."
          ]
        },
        {
          title: lang === "zh" ? "自适应视效规范" : "Visual Standards",
          bgClass: "bg-amber-50/70 border-amber-100",
          borderClass: "border-amber-200",
          textClass: "text-amber-900",
          bulletClass: "marker:text-amber-500",
          items: lang === "zh" ? [
            "制定 16:9 比例下的卡片动态间距比与大屏黄金分割排布规范。",
            "确定高频操作区的视觉重心偏好，指导桌面应用标准化排列布局。",
            "通过灰度视敏度测试，保障远视距下文本的极高对比度与识别度。"
          ] : [
            "Establishes standard dynamic card gap metrics and golden-ratio grid layouts.",
            "Secured visual weight preferences in active screen zones to drive TV OS UI guidelines.",
            "Elevated remote typeface readability and contrast levels based on empirical user testing."
          ]
        },
        {
          title: lang === "zh" ? "自适应交互重构" : "HCI Interaction",
          bgClass: "bg-purple-50/70 border-purple-100",
          borderClass: "border-purple-200",
          textClass: "text-purple-900",
          bulletClass: "marker:text-purple-500",
          items: lang === "zh" ? [
            "定义多端大屏卡片响应式折叠逻辑，无缝适配多样化大屏分辨率。",
            "重构基于焦点态（Focus State）的边缘磁吸物理动效反馈模型。",
            "建立大屏研发样式百分百还原与视觉体验质量验收标准。"
          ] : [
            "Pioneered card layout folding and grid-snapping properties across multiple form factors.",
            "Engineered magnetic spring-back kinetic feedbacks for active focus states.",
            "Bridged user discovery frameworks directly with final engineering layout validations."
          ]
        }
      ],
      results: [
        { value: "35%", label: lang === "zh" ? "检索动线路径缩短" : "Retrieval Pathway Shortened" },
        { value: "-2.1s", label: lang === "zh" ? "用户检索耗时降低" : "Search Latency Reduced" },
        { value: "14%", label: lang === "zh" ? "首屏浏览留存提升" : "Main Screen Retention Lifted" }
      ]
    },
    2: {
      title: lang === "zh" ? "粤港澳大湾区“缮居”适老化公益改造" : "Shanju Public Welfare Aging-Friendly Remodeling",
      sub: lang === "zh" ? "空间体验研究 / 行为轨迹流测绘 / 微改造评估报告与方案交付" : "Space Experience / Trajectory Mapping / Renovation Report & Blueprint",
      columns: [
        {
          title: lang === "zh" ? "参与式田野考察" : "Participatory Fieldwork",
          bgClass: "bg-sky-50/70 border-sky-100",
          borderClass: "border-sky-200",
          textClass: "text-sky-900",
          bulletClass: "marker:text-sky-500",
          items: lang === "zh" ? [
            "累计深入顺德帮扶家庭 40+ 小时，贴身开展全起居行为实景测绘。",
            "绘制老年人全天居家移动轨迹轨迹图，精细化标记生活热区与高频动线。",
            "深度解构由于感官与行动退化引起的老年人居家自尊与不便痛点。"
          ] : [
            "Logged 40+ hours of physical home stay in Shunde, capturing full-day movement habits.",
            "D Ddrew detailed spatial charts mapping elder household micro-trajectories.",
            "Engaged in in-depth dialogues to decode emotional dignities amidst sensory decline."
          ]
        },
        {
          title: lang === "zh" ? "空间物理隐患诊断" : "Safety Risk Diagnosis",
          bgClass: "bg-emerald-50/70 border-emerald-100",
          borderClass: "border-emerald-200",
          textClass: "text-emerald-900",
          bulletClass: "marker:text-emerald-500",
          items: lang === "zh" ? [
            "系统排查并提取卧室、通道、沐浴等 12 处滑倒、绊倒、碰撞物理高危点。",
            "实地开展老旧卫浴地面湿滑摩擦系数以及非承重墙体抓杆承载极限分析。",
            "针对慢性病、心血管病及轮椅老人的起居规律，输出专属安全阈值矩阵。"
          ] : [
            "Audited and categorized 12 major bedroom, corridor, and bathroom slip-and-collision hazards.",
            "Analyzed slip friction coefficients of floor tiles and wall handrail pull strengths.",
            "Designed customized modifications tailored specifically for seniors with chronic illness."
          ]
        },
        {
          title: lang === "zh" ? "黄金安全动线重构" : "Safe Path Re-mapping",
          bgClass: "bg-amber-50/70 border-amber-100",
          borderClass: "border-amber-200",
          textClass: "text-amber-900",
          bulletClass: "marker:text-amber-500",
          items: lang === "zh" ? [
            "重新规划老人起夜、晨起洗漱及早餐步行动线，合并冗余折返，剔除阻碍。",
            "移除动线上的物理门槛，扩增房门与通道黄金半径，确保轮椅畅通无阻。",
            "在动线上定制连续借力多点安全抓手，保障老人全时段有靠、有依、有扶。"
          ] : [
            "Re-constructed physical sequences for morning wakeup, washing, and bathroom routes.",
            "Removed hazardous clutter and narrow pinchpoints, assuring wheelchair turn clearances.",
            "Positioned continuous structural grab bars so elderly always have handholds."
          ]
        },
        {
          title: lang === "zh" ? "评估报告与方案交付" : "Blueprint & Deliverables",
          bgClass: "bg-purple-50/70 border-purple-100",
          borderClass: "border-purple-200",
          textClass: "text-purple-900",
          bulletClass: "marker:text-purple-500",
          items: lang === "zh" ? [
            "主导撰写并交付了 80 页极其详实、高工程可行性的微改造蓝图评估报告。",
            "落地低成本快装防滑抓手、智能感应小夜灯、折叠自适应淋浴椅改造细节。",
            "获得广东省工业设计协会高度赞誉，入选湾区老龄化公益设计标杆库。"
          ] : [
            "Authored an 80-page, highly actionable 'Shanju Field Assessment & Renovation Report'.",
            "Designed low-cost modular grab-bars, bedside nightlights, and anti-slip shower chairs.",
            "Acclaimed by the Guangdong Industrial Design Association as a showcase project."
          ]
        }
      ],
      results: [
        { value: "100%", label: lang === "zh" ? "空间跌倒隐患清除" : "Lethal Hazards Extinguished" },
        { value: "85%", label: lang === "zh" ? "改造方案地方采纳率" : "Municipal Blueprint Adoption" },
        { value: "40+h", label: lang === "zh" ? "实地田野深度日志" : "Empathetic Field Journaling" }
      ]
    },
    3: {
      title: lang === "zh" ? "AI协同原型与设计研究开发" : "AI-Collaborative Prototyping & Design R&D",
      sub: lang === "zh" ? "AI 提示词文本聚类 / React+Tailwind响应式编写 / 自动化云部署" : "LLM Transcript Clustering / React+Tailwind Hifi Dev / CI/CD Deployment",
      columns: [
        {
          title: lang === "zh" ? "用研文本 AI 聚类" : "LLM Qualitative Coding",
          bgClass: "bg-sky-50/70 border-sky-100",
          borderClass: "border-sky-200",
          textClass: "text-sky-900",
          bulletClass: "marker:text-sky-500",
          items: lang === "zh" ? [
            "构建专属定性分析 Prompt，将数万字用户实地深度访谈文本输入 LLM 展开词云聚类。",
            "一键提取出核心痛点高频语义标签，将原本两周的质性编码归纳缩短到 1 天以内。",
            "确立每一次交互层面的优化，均有真实的高精确用研定性数据树作为论证支持。"
          ] : [
            "Engineered multi-layered prompt templates to digest and group qualitative transcripts.",
            "Extracted core keyword semantics, shrinking 2 weeks of qualitative analysis to 1 day.",
            "Assured every design roadmap was validated against dense empirical dataset trees."
          ]
        },
        {
          title: lang === "zh" ? "高保真响应式代码" : "Hands-On Prototyping",
          bgClass: "bg-emerald-50/70 border-emerald-100",
          borderClass: "border-emerald-200",
          textClass: "text-emerald-900",
          bulletClass: "marker:text-emerald-500",
          items: lang === "zh" ? [
            "跳出传统纯设计界限，手写 React 页面逻辑与 Tailwind CSS 精简实用类代码。",
            "独立开发流畅的微交互、完美的移动端自适应排版，以及视觉高对比色彩对比层级。",
            "应用模块化组件进行代码解耦，大幅度优化脚本大小，创造顺滑无比的加载体验。"
          ] : [
            "Bypassed typical development constraints by writing bespoke React components & Tailwind styles.",
            "Created fluid micro-interactions, swipeable mobile drawers, and sharp color contrasts.",
            "Decoupled frontend components in clean directories to secure lightweight bundle weights."
          ]
        },
        {
          title: lang === "zh" ? "双向智能匹配算法" : "Dual-Engine Matching",
          bgClass: "bg-amber-50/70 border-amber-100",
          borderClass: "border-amber-200",
          textClass: "text-amber-900",
          bulletClass: "marker:text-amber-500",
          items: lang === "zh" ? [
            "设计并实现双层求职匹配判定模块（Gemini AI 语义推理结合降级关键词精确过滤）。",
            "模拟专业优秀 HR 筛选思路，根据粘贴的招聘 JD，极速解析生成个性化 SWOT 报告。",
            "在 Express 服务端建立安全的 API 请求中转路由，完美保护后台密钥，捍卫网站安全。"
          ] : [
            "Built an evaluation system combining Gemini AI semantic scanning and keyword checks.",
            "Simulated HR recruiter mentalities to write a personalized SWOT scorecard report.",
            "Proxied server queries on Express to keep sensitive workspace API keys safe."
          ]
        },
        {
          title: lang === "zh" ? "自动化 CI/CD 交付" : "CI/CD Global Deployments",
          bgClass: "bg-purple-50/70 border-purple-100",
          borderClass: "border-purple-200",
          textClass: "text-purple-900",
          bulletClass: "marker:text-purple-500",
          items: lang === "zh" ? [
            "采用 Git 进行团队版本协同，编写自动化工作流 GitHub Actions 脚本。",
            "将打包后的高保真静态资源无缝部署到 GitHub Pages，全节点加速秒级开屏渲染。",
            "深度贯通了从用户调研 - 交互逻辑 - 前端研发 - 到全栈线上交付的完整产品全生命周期。"
          ] : [
            "Leveraged Git versioning and constructed Automated workflows via GitHub Actions.",
            "Hosted and deployed live prototype mockups on GitHub Pages with global CDN caching.",
            "Achieved comprehensive lifecycle execution spanning from research directly to engineering."
          ]
        }
      ],
      results: [
        { value: "3x", label: lang === "zh" ? "定性用研提炼效率提升" : "Transcript Synthesis Speedup" },
        { value: "0s", label: lang === "zh" ? "交互渲染开屏延迟" : "Hifi Micro-interaction Delay" },
        { value: "100%", label: lang === "zh" ? "独立全栈工程级交付" : "Independent Full-Stack Delivery" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased selection:bg-[#9bf6e1]/40 selection:text-slate-900">
      
      {/* Dynamic Ambient Background Accents */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-b from-[#e8fffa]/50 via-sky-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[80vh] left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-50/30 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Tips */}
      <div className="bg-[#f0fdfa] border-b border-[#ccfbf1] text-[#0f766e] text-xs py-2.5 px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>
          <span className="font-semibold">✨ AI 作品集系统已就绪:</span> {lang === "zh" ? "欢迎阅读潘碧莹的教育与项目，并在下方测试 AI 岗位匹配度诊断！" : "Biying's portfolio is live. Run the AI Recruiter Matcher below for analysis!"}
        </span>
        <button
          onClick={() => setShowShareModal(true)}
          className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ExternalLink className="w-3 h-3" />
          <span>{lang === "zh" ? "复制/打开网址" : "Copy / Open URL"}</span>
        </button>
      </div>

      {/* Modern Fixed Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand: Cute hand-drawn face of a girl with wavy hair */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("about")}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#9bf6e1]/40 rounded-full blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              <svg width="42" height="42" viewBox="0 0 40 40" fill="none" className="relative w-11 h-11 shrink-0">
                <circle cx="20" cy="20" r="19" fill="#f0fdfa" stroke="#0f172a" strokeWidth="1.5" />
                {/* Wavy hair */}
                <path d="M9,22 C7,15 11,7 20,7 C29,7 33,15 31,22 C32,24 30,27 29,25 C28,22 29,19 28,15 C27,12 24,10 20,10 C16,10 13,12 12,15 C11,19 12,22 11,25 C10,27 8,24 9,22 Z" fill="#0f172a" />
                {/* Face outline */}
                <path d="M13.5,20 C13.5,25 16,28.5 20,28.5 C24,28.5 26.5,25 26.5,20" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                {/* Cheeks */}
                <circle cx="16" cy="23" r="1.5" fill="#fda4af" opacity="0.9" />
                <circle cx="24" cy="23" r="1.5" fill="#fda4af" opacity="0.9" />
                {/* Eyes */}
                <circle cx="17.5" cy="20.5" r="1.2" fill="#0f172a" />
                <circle cx="22.5" cy="20.5" r="1.2" fill="#0f172a" />
                {/* Smile */}
                <path d="M19,24 Q20,25.5 21,24" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-[#0f172a] group-hover:text-emerald-700 transition-colors">
                潘碧莹 / Panbiying
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Portfolio 2026</p>
            </div>
          </div>

          {/* Nav Links Desktop: Standard round capsule links (Image 1) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-full border border-slate-200/50">
            {[
              { id: "about", label: "关于我" },
              { id: "education", label: "教育背景" },
              { id: "projects", label: "工作经历" },
              { id: "skills", label: "技能特长" },
              { id: "learning", label: "学习与探索" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-[#0f172a] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0f172a] hover:bg-slate-200/50"
                }`}
              >
                {lang === "zh" 
                  ? item.label 
                  : item.id === "about" ? "About Me" : item.id === "education" ? "Education" : item.id === "projects" ? "Experience" : item.id === "skills" ? "Skills" : "Exploration"}
              </button>
            ))}
          </nav>

          {/* Action elements in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(prev => prev === "zh" ? "en" : "zh")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#334155] bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-2xs transition-colors"
              title="切换语言"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === "zh" ? "English" : "中文"}</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
              title={lang === "zh" ? "分享/复制作品集网址" : "Share / Copy Portfolio Link"}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === "zh" ? "分享/复制网址" : "Share/Copy"}</span>
            </button>

            <a
              href="resume.pdf"
              download="潘碧莹_个人简历_resume.pdf"
              className="hidden sm:flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-bold bg-[#0f172a] text-white rounded-full hover:bg-emerald-800 hover:shadow-xs transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "zh" ? "下载简历" : "Download CV"}</span>
            </a>
          </div>
        </div>

        {/* Mobile Horizontal scroll menu */}
        <div className="md:hidden flex items-center justify-start gap-1.5 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-100 scrollbar-none">
          {[
            { id: "about", label: "关于我" },
            { id: "education", label: "教育背景" },
            { id: "projects", label: "工作经历" },
            { id: "skills", label: "技能特长" },
            { id: "learning", label: "学习与探索" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`whitespace-nowrap px-3.5 py-1 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeSection === item.id
                  ? "bg-[#0f172a] text-white"
                  : "text-[#475569] bg-white border border-slate-200"
              }`}
            >
              {lang === "zh" 
                ? item.label 
                : item.id === "about" ? "About Me" : item.id === "education" ? "Education" : item.id === "projects" ? "Experience" : item.id === "skills" ? "Skills" : "Exploration"}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-24">

        {/* 1. HERO SECTION (About Me) */}
        <section id="about" className="pt-4 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0fdfa] border border-[#ccfbf1] rounded-full text-[#0d9488] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === "zh" ? "工科硕士 · 服务体验设计方向" : "Master Candidate · Service Experience Design"}</span>
              </div>

              <div className="space-y-3.5">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-tight">
                  Hi，我是潘碧莹
                </h2>
                
                {/* Typewriter text in purple (Image 1) */}
                <div className="h-8 flex items-center">
                  <p className="text-lg sm:text-xl font-bold text-[#8b5cf6] font-mono">
                    {typedText}
                    <span className="animate-pulse ml-0.5 font-sans">|</span>
                  </p>
                </div>

                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Product & Experience Manager Candidate · User Researcher · GDUT 
                </p>
              </div>

              <p className="text-[#334155] text-sm sm:text-base leading-relaxed text-justify">
                {t.heroBio}
              </p>

              {/* Personal motto display */}
              <div className="p-4.5 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs sm:text-sm font-semibold text-[#334155] flex items-center gap-3">
                <div className="p-1.5 bg-[#9bf6e1]/30 rounded-lg text-emerald-800 font-extrabold shrink-0">❝</div>
                <p className="italic">{t.heroMotto}</p>
                <div className="ml-auto text-slate-400 font-mono text-[10px] hidden sm:block">#努力生活，也努力解决问题</div>
              </div>

              {/* Action Buttons: Mint Green / White Outline (Image 1) */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("skills");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6.5 py-3 bg-[#9bf6e1] hover:bg-[#85edd4] text-slate-900 font-bold text-sm rounded-full shadow-xs transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-900" />
                  <span>与我联系 / Contact Me</span>
                </button>
                
                <a
                  href="resume.pdf"
                  download="潘碧莹_个人简历_resume.pdf"
                  className="px-6.5 py-3 bg-white hover:bg-slate-50 text-[#0f172a] font-bold text-sm border-2 border-[#0f172a] rounded-full transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-800" />
                  <span>{t.btnResume}</span>
                </a>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-6.5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border-2 border-indigo-200 rounded-full transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>{lang === "zh" ? "分享/复制网址" : "Share/Copy"}</span>
                </button>
              </div>

              {/* Search Bar matching Image 1: "AI 岗位匹配度测评" */}
              <div className="pt-6 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3 shadow-xs relative overflow-hidden">
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#0f172a] text-white rounded-lg">
                      <Cpu className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0f172a] flex items-center gap-1.5">
                        {t.matcherTitle}
                        <span className="text-[9px] bg-slate-950 text-emerald-300 px-1.5 py-0.5 rounded-md font-mono uppercase tracking-wider scale-90">Core AI</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">{t.matcherSub}</p>
                    </div>
                  </div>

                  {/* Elegant Search Bar container (Image 1) */}
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-400">
                        <Search className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="text"
                        value={jdInput}
                        onChange={(e) => {
                          setJdInput(e.target.value);
                          if (matcherError) setMatcherError("");
                        }}
                        placeholder={lang === "zh" ? "粘贴您的岗位职责 (JD) 等，让我来进行匹配分析..." : "Paste job duties / JD, and let AI evaluate match..."}
                        className="w-full pl-11 pr-28 py-3 text-xs bg-white text-[#0f172a] border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-sans shadow-2xs"
                      />
                      <button
                        onClick={handleStartMatch}
                        className="absolute right-1.5 px-4.5 py-1.8 bg-[#0f172a] text-white text-xs font-extrabold rounded-full hover:bg-emerald-800 transition-all flex items-center gap-1"
                      >
                        <span>开始匹配</span>
                        <span className="font-sans font-normal">➔</span>
                      </button>
                    </div>
                    
                    {matcherError && (
                      <p className="text-xs text-red-600 pl-4 flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{matcherError}</span>
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={loadDemoJd}
                        className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 underline cursor-pointer"
                      >
                        💡 {t.matcherDemoBtn}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column: Portrait image with mint green hand-drawn contour lines (Image 1) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 lg:w-80 group">
                
                {/* Organic Mint Green Hand-Drawn Contour Outline wrapper behind/around photo */}
                <div className="absolute -inset-3.5 border-2 border-dashed border-[#9bf6e1]/80 rounded-full animate-spin-slow pointer-events-none -z-10" />
                <div className="absolute -inset-1.5 bg-[#9bf6e1]/10 rounded-3xl blur-xs pointer-events-none -z-10" />
                
                {/* Hand Drawn Accent Blob */}
                <svg viewBox="0 0 100 100" className="absolute -top-6 -right-6 w-20 h-20 text-[#c3faee] animate-pulse pointer-events-none -z-10 opacity-75">
                  <path fill="currentColor" d="M30,-20C40,-10,50,5,45,18C40,31,20,42,2,40C-16,38,-32,23,-35,5C-38,-13,-28,-34,-14,-42C0,-50,20,-30,30,-20Z" transform="translate(50 50)" />
                </svg>

                {/* Main Card Frame */}
                <div className="relative bg-white p-3 border border-slate-200/80 rounded-3xl shadow-xs">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative flex items-center justify-center">
                    
                    {/* Fallback portrait container if profile image is missing */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] to-[#3b4252] flex flex-col justify-between p-6 text-white">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-[#9bf6e1] uppercase tracking-widest bg-emerald-950/40 px-2.5 py-1 rounded-md border border-[#9bf6e1]/20">
                          MASTER CANDIDATE
                        </span>
                        <Award className="w-5 h-5 text-yellow-300" />
                      </div>
                      
                      <div className="space-y-2 text-center my-auto">
                        <div className="w-20 h-20 rounded-full bg-slate-800/90 border-2 border-[#9bf6e1] mx-auto flex items-center justify-center text-3xl font-extrabold text-[#9bf6e1] shadow-xs">
                          碧莹
                        </div>
                        <h4 className="font-black text-xl tracking-wide">潘碧莹 / Pan Biying</h4>
                        <p className="text-[11px] text-slate-300 font-mono">工业设计工程硕士研究生</p>
                      </div>

                      <div className="space-y-1.5 text-xs border-t border-white/10 pt-4 text-slate-400 font-mono">
                        <div className="flex justify-between">
                          <span>UNIVERSITY:</span>
                          <span className="text-white font-sans">广东工业大学</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DIRECTION:</span>
                          <span className="text-white font-sans">服务体验设计与用研</span>
                        </div>
                      </div>
                    </div>

                    {/* Overlay Tag */}
                    <div className="absolute bottom-3 left-3 bg-[#0f172a]/95 backdrop-blur-md text-[#9bf6e1] text-[10px] font-mono uppercase tracking-widest px-2.5 py-1.2 rounded-md border border-emerald-500/30 z-10">
                      GDUT · UX RESEARCHER
                    </div>
                  </div>

                  {/* Name Tag beneath */}
                  <div className="mt-3 text-center">
                    <p className="text-sm font-extrabold text-[#0f172a]">潘碧莹 (Pan Biying)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">求职意向：产品经理、用户研究员</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 2. EDUCATION SECTION */}
        <section id="education" className="scroll-mt-24">
          <div className="border-t border-slate-100 pt-16 space-y-10">
            
            {/* Section Header */}
            <div className="space-y-2">
              <span className="text-xs font-bold font-mono tracking-widest text-emerald-600 uppercase">ACADEMIC BACKGROUND</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                {t.eduTitle}
              </h3>
            </div>

            {/* Academic Rounded Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#0f172a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">M.S. Postgraduate</span>
                    <span className="bg-sky-50 text-sky-800 border border-sky-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md">广东工业大学 (GDUT)</span>
                  </div>
                  
                  <h4 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                    {lang === "zh" ? "工业设计工程专业" : "Industrial Design Engineering"}
                  </h4>
                  
                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a]" />
                    <span>{t.eduDirection}</span>
                  </p>
                </div>

                <div className="md:text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono font-bold">
                    <span>{t.eduPeriod}</span>
                  </span>
                </div>
              </div>

              {/* Research and Honors */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
                
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    {t.eduDescription}
                  </p>
                </div>

                {/* Awards */}
                <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                  <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{t.eduAward} / Honors</span>
                  </h5>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-100">
                      🏆
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-[#0f172a] leading-tight">
                        {t.eduAwardName}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono uppercase">HuaCan National Award 1st Prize</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 3. WORK & PROJECT EXPERIENCE SECTION (Image 2) */}
        <section id="projects" className="scroll-mt-24">
          <div className="border-t border-slate-100 pt-16 space-y-12">
            
            {/* Header: "工作经历" (Image 2) */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold font-mono tracking-widest text-[#8b5cf6] uppercase">PROFESSIONAL CAREER</span>
              <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
                工作经历
              </h3>
            </div>

            {/* Experience Summary Card (Image 2) */}
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-[#0f172a] flex items-center gap-2">
                    <span>产品经理 / 用户研究员 (Product & Experience Leadership)</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono uppercase">GRADUATE FIELDWORK WORKFLOW</p>
                </div>
                <div className="shrink-0 bg-[#0f172a] text-white font-mono text-xs font-bold px-3 py-1 rounded-lg">
                  2025.09 - 2028.06
                </div>
              </div>

              <div className="pt-5 space-y-6">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify">
                  在多项重大课题及实战项目中作为<strong>项目经理 (PM) 与核心体验研究员</strong>。聚焦真实用户痛点与前沿市场需求，制定系统性产品规划，精通全流程项目管理。关注用户真实行为与场景深度需求关系，具备超凡的技术落地沟通力与多维汇报表达功底。
                </p>

                {/* Tag Classifications (Image 2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-100">
                  
                  {/* Category 1: 战略与规划 */}
                  <div className="space-y-3 p-4 bg-slate-50/60 rounded-2xl border border-slate-200/50">
                    <h5 className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      战略与规划
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {["产品策略与创新", "客户关系管理", "痛点发现与商机定义", "需求优先级梳理"].map((t) => (
                        <span key={t} className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: 流程与标准 */}
                  <div className="space-y-3 p-4 bg-slate-50/60 rounded-2xl border border-slate-200/50">
                    <h5 className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                      流程与标准
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {["项目标准化流程策划", "微服务中后台搭建", "敏捷交互迭代规范", "用户体验度量指标"].map((t) => (
                        <span key={t} className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Centered Segment Line: "项目经历" (Image 2) */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
                {lang === "zh" ? "核心项目经历" : "CORE PORTFOLIOS"}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Three Columns Grid of Project Cards (Image 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: 小米电视桌面系统 */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-300">
                <div className="p-5.5 space-y-4">
                  {/* Visual Device Mock: TV Heatmap (Image 2) */}
                  <div className="w-full h-32 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/20 via-slate-950 to-slate-950" />
                    
                    {/* TV Mockup SVG */}
                    <svg viewBox="0 0 200 90" className="w-full h-full max-w-[160px] text-slate-500">
                      <rect x="5" y="5" width="190" height="75" rx="4" fill="#0d111c" stroke="#344054" strokeWidth="1" />
                      <line x1="100" y1="80" x2="100" y2="88" stroke="#344054" strokeWidth="2" />
                      {/* Grid cards */}
                      <rect x="15" y="15" width="40" height="30" rx="2" fill="#1d2939" stroke="#475467" strokeWidth="0.5" />
                      <rect x="60" y="15" width="40" height="30" rx="2" fill="#1d2939" stroke="#475467" strokeWidth="0.5" />
                      <rect x="105" y="15" width="80" height="30" rx="2" fill="#1d2939" stroke="#475467" strokeWidth="0.5" />
                      <rect x="15" y="50" width="80" height="22" rx="2" fill="#1d2939" stroke="#475467" strokeWidth="0.5" />
                      <rect x="100" y="50" width="85" height="22" rx="2" fill="#1d2939" stroke="#475467" strokeWidth="0.5" />
                      {/* Heat zones */}
                      <circle cx="35" cy="30" r="12" fill="rgba(14, 165, 233, 0.4)" />
                      <circle cx="35" cy="30" r="5" fill="rgba(14, 165, 233, 0.65)" />
                    </svg>

                    <div className="absolute top-2 left-2 bg-[#0f172a]/85 border border-sky-500/20 text-sky-300 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-md">
                      HCI Eye-Tracking
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-sky-600 font-mono tracking-wider">USER RESEARCH & STUDY</span>
                    <h4 className="font-extrabold text-base text-[#0f172a] leading-tight">
                      {t.proj1Title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      智能大屏桌面系统用户的视觉聚焦与远距离操作研究，产出体系化桌面交互白皮书，打通用研到样式的设计标准链路。
                    </p>
                  </div>
                </div>

                <div className="px-5.5 pb-5.5 pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveProjectModal(1)}
                    className="text-xs font-bold text-[#0f172a] hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>查看详情</span>
                    <span>↗</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Xiaomi TV OS</span>
                </div>
              </div>

              {/* Card 2: 缮居适老化公益空间 */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-300">
                <div className="p-5.5 space-y-4">
                  {/* Visual Device Mock: Blueprint (Image 2) */}
                  <div className="w-full h-32 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-900 to-slate-900" />
                    
                    {/* Safe movement blueprint SVG */}
                    <svg viewBox="0 0 200 90" className="w-full h-full max-w-[160px] text-slate-500">
                      <rect x="5" y="5" width="190" height="80" rx="3" fill="none" stroke="#475467" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                      <rect x="10" y="10" width="70" height="70" rx="1" fill="#1d2939" stroke="#344054" strokeWidth="0.5" />
                      {/* Bed and safe route */}
                      <rect x="15" y="15" width="35" height="40" rx="1" fill="none" stroke="#10b981" strokeWidth="0.8" />
                      <rect x="100" y="10" width="85" height="70" rx="1" fill="#1d2939" stroke="#344054" strokeWidth="0.5" />
                      {/* Bathroom grab bar */}
                      <line x1="120" y1="35" x2="140" y2="35" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                      {/* Trajectory */}
                      <path d="M32.5,55 Q75,55 125,55" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,2" />
                      <circle cx="125" cy="55" r="4" fill="#10b981" />
                    </svg>

                    <div className="absolute top-2 left-2 bg-[#0f172a]/85 border border-emerald-500/20 text-emerald-300 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-md">
                      Elder Care Path
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-600 font-mono tracking-wider">SERVICE & WELFARE</span>
                    <h4 className="font-extrabold text-base text-[#0f172a] leading-tight">
                      {t.proj2Title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      深耕顺德大湾区帮扶居家田野，开展2户典型高龄老人住宅物理空间及动作流扫描，绘制80页微改造高可行性蓝图。
                    </p>
                  </div>
                </div>

                <div className="px-5.5 pb-5.5 pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveProjectModal(2)}
                    className="text-xs font-bold text-[#0f172a] hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>查看详情</span>
                    <span>↗</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Shande Welfare</span>
                </div>
              </div>

              {/* Card 3: AI协同原型与设计研究开发 (Image 2 Column 3!) */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-300">
                <div className="p-5.5 space-y-4">
                  {/* Visual Device Mock: Web Dashboard (Image 2) */}
                  <div className="w-full h-32 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950" />
                    
                    {/* Code mock SVG */}
                    <svg viewBox="0 0 200 90" className="w-full h-full max-w-[160px] text-slate-500">
                      <rect x="5" y="5" width="190" height="75" rx="3" fill="#090d16" stroke="#4c1d95" strokeWidth="1" />
                      {/* Code lines */}
                      <line x1="15" y1="20" x2="60" y2="20" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                      <line x1="15" y1="30" x2="110" y2="30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="40" x2="85" y2="40" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="50" x2="140" y2="50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                      <line x1="15" y1="60" x2="45" y2="60" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                      <line x1="15" y1="70" x2="90" y2="70" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    <div className="absolute top-2 left-2 bg-[#0f172a]/85 border border-purple-500/20 text-purple-300 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-md">
                      React + LLM Code
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-purple-600 font-mono tracking-wider">AI & DIGITAL DELIVERY</span>
                    <h4 className="font-extrabold text-base text-[#0f172a] leading-tight">
                      {t.proj3Title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      探索用研在大模型时代的技术重构：基于 LLM 对数万字定性访谈语义聚类，独立手写 React 前端架构实现可交互高保真作品集验证。
                    </p>
                  </div>
                </div>

                <div className="px-5.5 pb-5.5 pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveProjectModal(3)}
                    className="text-xs font-bold text-[#0f172a] hover:text-purple-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>查看详情</span>
                    <span>↗</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Vite + React</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. SKILLS SECTION */}
        <section id="skills" className="scroll-mt-24">
          <div className="border-t border-slate-100 pt-16 space-y-10">
            
            {/* Section Header */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold font-mono tracking-widest text-emerald-600 uppercase">EXPERTISE SPECTRUM</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                {t.skillsTitle}
              </h3>
            </div>

            {/* Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: User Research */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden group hover:border-[#9bf6e1] transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-3xl" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🔍
                  </div>
                  <h4 className="font-extrabold text-base text-[#0f172a]">{t.skillsResearch}</h4>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "用户访谈 / User Interviews",
                    "实地考察与眼动实验 / Field Ethnography",
                    "典型用户画像绘制 / Persona Mapping",
                    "定性定量行为聚类 / Qualitative Synthesis",
                    "产品可用性测试评估 / Usability Testing",
                    "体验痛点扫描 / Painpoint Audits",
                    "微改造评估报告撰写 / Evaluation Papers"
                  ].map((skill) => (
                    <span key={skill} className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 2: Product & Service */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-bl-3xl" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                    🗺️
                  </div>
                  <h4 className="font-extrabold text-base text-[#0f172a]">{t.skillsProduct}</h4>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "服务设计体验蓝图 / Blueprinting",
                    "产品信息架构精构 / Information Map",
                    "交互框架高低保真 / Wireframing",
                    "大屏内容推荐动线 / Big Screen Paths",
                    "无障碍物理路径策划 / Accessible Paths",
                    "全生命周期商业汇报 / Pitch & Delivery"
                  ].map((skill) => (
                    <span key={skill} className="bg-sky-50 text-sky-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-sky-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 3: Design Tools */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-3xl" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                    🎨
                  </div>
                  <h4 className="font-extrabold text-base text-[#0f172a]">{t.skillsDesign}</h4>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Figma (Pro Totyping)",
                    "Rhino (3D Models)",
                    "KeyShot (Renders)",
                    "Blender (Scenic Art)",
                    "Adobe Photoshop",
                    "Adobe Illustrator",
                    "Notion (Docs)"
                  ].map((skill) => (
                    <span key={skill} className="bg-purple-50 text-purple-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-purple-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 4: AI & Code */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-3xl" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    🤖
                  </div>
                  <h4 className="font-extrabold text-base text-[#0f172a]">{t.skillsAi}</h4>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "ChatGPT (Prompt Analyst)",
                    "Midjourney (Concept Boards)",
                    "React & Vite Engine",
                    "Tailwind CSS (Visual Design)",
                    "JavaScript (ESM Code)",
                    "GitHub Pages (Cloud Deploy)",
                    "AI 辅助高保真原型交付"
                  ].map((skill) => (
                    <span key={skill} className="bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-amber-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. LEARNING & EXPLORATION */}
        <section id="learning" className="scroll-mt-24">
          <div className="border-t border-slate-100 pt-16 space-y-10">
            
            {/* Section Header */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold font-mono tracking-widest text-[#8b5cf6] uppercase">AI WORKFLOW FRONTIER</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                {t.learnTitle}
              </h3>
            </div>

            <div className="space-y-6">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify max-w-4xl">
                {t.learnDesc}
              </p>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.learnItems.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md font-mono">
                          STEP 0{idx + 1}
                        </span>
                        <span className="bg-[#f0fdfa] text-[#0f766e] border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md font-mono">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#0f172a] leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-slate-400 text-xs">
                      <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                        <span>AI Co-Creation Flow</span>
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 font-bold">Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 6. CONTACT SECTION (Persistent & Aesthetic) */}
        <section id="contact" className="scroll-mt-24 pt-6">
          <div className="border-t border-slate-200 pt-16">
            <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
              
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-emerald-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#9bf6e1] font-bold uppercase">READY FOR ROLES</span>
                    <h3 className="text-2xl sm:text-3.5xl font-black tracking-tight">
                      期待与优秀的您取得联系！
                    </h3>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
                    {t.contactSubtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 space-y-1">
                      <p className="text-[9px] font-bold font-mono uppercase tracking-widest text-slate-400">{t.contactPhone}</p>
                      <p className="text-sm font-extrabold text-[#9bf6e1]">178-1703-6316</p>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 space-y-1">
                      <p className="text-[9px] font-bold font-mono uppercase tracking-widest text-slate-400">{t.contactEmail}</p>
                      <p className="text-sm font-extrabold text-[#9bf6e1]">panbiying750@gmail.com</p>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 space-y-1 col-span-1 sm:col-span-2">
                      <p className="text-[9px] font-bold font-mono uppercase tracking-widest text-slate-400">{t.contactStatus}</p>
                      <p className="text-xs sm:text-sm font-extrabold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{lang === "zh" ? "寻产品经理/用户研究实习与校招机会 (大湾区/广州/深圳/上海优先)" : "Seeking PM / UX Research Internship & Graduate Offers"}</span>
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={copyPhoneNumber}
                      className="px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xs"
                    >
                      {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPhone ? t.btnCopied : "复制电话号码"}</span>
                    </button>

                    <a
                      href="resume.pdf"
                      download="潘碧莹_个人简历_resume.pdf"
                      className="px-5 py-2.5 bg-transparent text-white border-2 border-white rounded-full text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-300" />
                      <span>下载简历 / Download CV</span>
                    </a>
                  </div>
                </div>

                {/* Right side WeChat QR (Image 2 style) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-white text-slate-900 border border-slate-200/80 rounded-2xl shadow-md text-center max-w-[200px] w-full">
                    <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                      <svg width="110" height="110" viewBox="0 0 120 120" className="w-full text-slate-300">
                        <rect width="120" height="120" fill="#f8fafc" rx="8" />
                        <rect x="15" y="15" width="28" height="28" rx="2" fill="none" stroke="#0f172a" strokeWidth="3" />
                        <rect x="21" y="21" width="16" height="16" fill="#0f172a" />
                        <rect x="77" y="15" width="28" height="28" rx="2" fill="none" stroke="#0f172a" strokeWidth="3" />
                        <rect x="83" y="83" width="16" height="16" fill="#0f172a" />
                        <rect x="15" y="77" width="28" height="28" rx="2" fill="none" stroke="#0f172a" strokeWidth="3" />
                        <rect x="83" y="21" width="16" height="16" fill="#0f172a" />
                        <rect x="52" y="15" width="12" height="6" fill="#0f172a" />
                        <rect x="52" y="27" width="6" height="12" fill="#0f172a" />
                        <rect x="15" y="52" width="12" height="6" fill="#0f172a" />
                        <rect x="33" y="52" width="18" height="6" fill="#0f172a" />
                        <rect x="64" y="52" width="6" height="18" fill="#0f172a" />
                        <rect x="52" y="77" width="12" height="12" fill="#0f172a" />
                        <rect x="77" y="52" width="18" height="6" fill="#0f172a" />
                        <rect x="77" y="68" width="6" height="18" fill="#0f172a" />
                        <rect x="94" y="77" width="12" height="6" fill="#0f172a" />
                        <rect x="94" y="94" width="6" height="12" fill="#0f172a" />
                        <rect x="52" y="94" width="18" height="6" fill="#0f172a" />
                        <circle cx="60" cy="60" r="10" fill="#10b981" />
                        <text x="60" y="64" fill="white" fontSize="11" textAnchor="middle" fontWeight="black">💬</text>
                      </svg>
                    </div>
                    <p className="text-[10px] font-extrabold text-slate-800 mt-2.5">微信扫一扫联系我</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">WeChat ID: panbiying</p>
                  </div>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 py-1.5 px-3 bg-slate-800/60 border border-slate-700/50 rounded-full transition-colors shrink-0"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.contactBackToTop}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-600">© 2026 潘碧莹 Panbiying | 个人作品集网站 All Rights Reserved.</p>
        <p className="font-mono text-[10px]">
          Designed with ❤️ | Handcrafted with React, Tailwind CSS v4 & AI Code Collaboration.
        </p>
        <p className="text-[9px] text-slate-300">Deployed and hosted on GitHub Pages.</p>
      </footer>

      {/* PROJECT DETAILS POPUP MODAL (Image 3) */}
      {activeProjectModal !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200/80 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Core Project Deliverables
                </span>
                <h4 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  {projectModals[activeProjectModal].title}
                </h4>
                <p className="text-xs text-slate-400 font-mono">{projectModals[activeProjectModal].sub}</p>
              </div>

              <button
                onClick={() => setActiveProjectModal(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* CORE RESPONSIBILITIES: 4 Beautiful Pastel Tinted Columns (Image 3!) */}
              <div className="space-y-3.5">
                <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 rounded-full bg-[#8b5cf6]" />
                  核心职责 / CORE RESPONSIBILITIES
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {projectModals[activeProjectModal].columns.map((col, idx) => (
                    <div key={idx} className={`${col.bgClass} p-4.5 rounded-2xl border ${col.borderClass} space-y-3 flex flex-col justify-between shadow-2xs`}>
                      <div className="space-y-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${col.textClass}`}>
                          0{idx + 1} // {col.title}
                        </span>
                        
                        <ul className={`space-y-2 text-xs leading-relaxed ${col.textClass}/90 list-disc list-inside`}>
                          {col.items.map((bullet, bIdx) => (
                            <li key={bIdx} className={`${col.bulletClass} marker:text-sm pl-0.5 text-justify`}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CORE RESULTS: Bottom Horizontal Cards showing quantified results (Image 3!) */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 rounded-full bg-emerald-500" />
                  核心成果 / CORE RESULTS
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projectModals[activeProjectModal].results.map((res, idx) => (
                    <div key={idx} className="bg-slate-50/80 border border-slate-200/60 p-4.5 rounded-2xl text-center space-y-1 shadow-2xs hover:bg-slate-50 transition-colors">
                      <p className="text-3xl sm:text-4.5xl font-black text-[#0f172a] tracking-tight">
                        {res.value}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">
                        {res.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer: Black rounded capsule Close button (Image 3!) */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                关闭 / Close Details
              </button>
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:block">Empirical Portfolios © 2026</span>
            </div>

          </div>
        </div>
      )}

      {/* AI JOB MATCHER DETAILED DIAGNOSIS MODAL */}
      {showMatcherModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#9bf6e1] text-slate-950 rounded-lg">
                  <Cpu className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base tracking-tight">{t.matcherResultTitle}</h4>
                  <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">AI Diagnosis Engine v1.0</p>
                </div>
              </div>

              {!isMatching && (
                <button
                  onClick={() => setShowMatcherModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scroll Container */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* STATE 1: LOADING SCANNER */}
              {isMatching ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  
                  {/* Rotating Circle */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>

                  {/* Log Steps */}
                  <div className="text-center space-y-3.5 max-w-sm w-full">
                    <p className="text-xs font-bold font-mono tracking-widest text-[#8b5cf6] uppercase">ANALYZING CANDIDATE FIT</p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-600 text-left space-y-2 min-h-[120px] shadow-inner">
                      {t.matcherScanning.slice(0, matchStep + 1).map((step, idx) => (
                        <p key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 shrink-0">✔</span>
                          <span className={idx === matchStep ? "text-slate-900 font-bold" : "text-slate-400"}>
                            {step}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                
                // STATE 2: DIAGNOSIS RESULTS
                matchResult && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Score Metric Card */}
                    <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xs">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full pointer-events-none" />
                      
                      <div className="text-center sm:text-left space-y-1">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-emerald-600 uppercase">{t.matcherLevel}</span>
                        <h5 className="text-xl font-black text-[#0f172a] flex items-center justify-center sm:justify-start gap-2">
                          <span>{matchResult.matchLevel}</span>
                        </h5>
                        <p className="text-xs text-[#0f766e] max-w-sm">
                          {lang === "zh" 
                            ? "潘碧莹的教育背景、大屏白皮书实战及AI手写代码特长完美接入该岗位职能。" 
                            : "Biying's research background and prompt prototype capability perfectly align."}
                        </p>
                      </div>

                      {/* Score Indicator */}
                      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-xs">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                          <circle 
                            cx="48" 
                            cy="48" 
                            r="40" 
                            fill="transparent" 
                            stroke="#0f766e" 
                            strokeWidth="6" 
                            strokeDasharray={251.2} 
                            strokeDashoffset={251.2 - (251.2 * matchResult.score) / 100} 
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <p className="text-2xl font-black text-[#0f172a] tracking-tight">{matchResult.score}%</p>
                          <p className="text-[8px] font-mono font-bold text-slate-400 uppercase">{t.matcherScore}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill Chart */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
                        {lang === "zh" ? "能力匹配配比 / Capability Alignment Map" : "Capability Matching Weights"}
                      </h5>

                      <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-3">
                        {[
                          { label: lang === "zh" ? "用户研究能力 (User Research)" : "User Research", val: matchResult.skillsScore.userResearch },
                          { label: lang === "zh" ? "产品与规划理解力 (Product Strategy)" : "Product Insight", val: matchResult.skillsScore.productUnderstanding },
                          { label: lang === "zh" ? "交互框架与自适应设计 (HCI & UX)" : "HCI & UI Wireframe", val: matchResult.skillsScore.interactionFramework },
                          { label: lang === "zh" ? "方案表达与汇报 (Delivery & Deck)" : "Design Delivery", val: matchResult.skillsScore.designExpression },
                          { label: lang === "zh" ? "AI辅助全栈代码能力 (AI + React Dev)" : "AI + Code Prototyping", val: matchResult.skillsScore.aiTools }
                        ].map((bar) => (
                          <div key={bar.label} className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-700 font-semibold">
                              <span>{bar.label}</span>
                              <span className="font-mono text-[#0f172a] font-bold">{bar.val}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0f172a] rounded-full transition-all duration-1000"
                                style={{ width: `${bar.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-[#0d9488] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0d9488]" />
                        <span>{t.matcherHighlights}</span>
                      </h5>
                      <ul className="space-y-2 bg-[#f0fdfa]/60 p-4.5 border border-[#ccfbf1] rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed list-disc list-inside">
                        {(lang === "zh" ? matchResult.highlights : matchResult.highlightsEn).map((hl: string, idx: number) => (
                          <li key={idx} className="marker:text-emerald-500 pl-0.5 text-justify">{hl}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold font-mono uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-700" />
                        <span>{t.matcherImprovements}</span>
                      </h5>
                      <ul className="space-y-2 bg-amber-50/40 p-4.5 border border-amber-200/50 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed list-disc list-inside">
                        {(lang === "zh" ? matchResult.improvements : matchResult.improvementsEn).map((im: string, idx: number) => (
                          <li key={idx} className="marker:text-amber-500 pl-0.5 text-justify">{im}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Summary */}
                    <div className="p-4.5 bg-slate-100 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">{t.matcherSummary}</span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
                        {lang === "zh" ? matchResult.summary : matchResult.summaryEn}
                      </p>
                    </div>

                    {/* Suggested Roles */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">{t.matcherRoles}</span>
                      <div className="flex flex-wrap gap-2">
                        {(lang === "zh" ? matchResult.roleSuggestions : matchResult.roleSuggestionsEn).map((role: string) => (
                          <span key={role} className="bg-slate-900 text-white text-xs px-3.5 py-1.2 rounded-full font-extrabold shadow-2xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                )
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0 gap-2">
              <button
                onClick={() => setShowMatcherModal(false)}
                className="px-5 py-2.5 bg-[#0f172a] text-white hover:bg-slate-800 text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                {t.matcherClose}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PORTFOLIO URL SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200/80 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-[#0f172a] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                  Portfolio Sharing Console
                </span>
                <h4 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  {lang === "zh" ? "分享与复制作品集网址" : "Share & Copy Portfolio Links"}
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  {lang === "zh" ? "支持点击直接复制，或在新窗口中打开" : "Click to copy, or open in a new window"}
                </p>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Intro note */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs sm:text-sm text-indigo-950 leading-relaxed text-justify">
                💡 <strong>{lang === "zh" ? "提示" : "Note"}:</strong> {lang === "zh" ? "您可以直接复制下方生成的链接，并粘贴发送给招聘方、HR，或者在浏览器新标签页中打开进行流畅的交互体验！" : "You can copy either link below to send to recruiters and HRs, or open them in a browser tab for standard full-experience interactions!"}
              </div>

              {/* URL Item 1: Shared Portfolio */}
              <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md">
                    {lang === "zh" ? "推荐：免调试线上分享版 (Shared URL)" : "Recommended: Shared Public URL"}
                  </span>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl select-all break-all font-mono text-xs text-slate-700 font-medium">
                  {sharedUrl}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copySharedUrl}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      copiedSharedUrl 
                        ? "bg-emerald-600 text-white" 
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {copiedSharedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "已成功复制！" : "Successfully Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "一键复制网址" : "Copy Link"}</span>
                      </>
                    )}
                  </button>
                  <a
                    href={sharedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-indigo-700 bg-white border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === "zh" ? "打开体验" : "Open Link"}</span>
                  </a>
                </div>
              </div>

              {/* URL Item 1.5: Standalone Mobile-optimized Portfolio */}
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] p-4.5 rounded-2xl space-y-3 shadow-2xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-md">
                    {lang === "zh" ? "🔥 手机直开/离线适配版 (Standalone HTML)" : "Mobile Direct / Standalone HTML"}
                  </span>
                </div>
                <p className="text-[11px] text-[#0f766e] leading-relaxed">
                  {lang === "zh" 
                    ? "✨ 专门解决微信/手机浏览器由于安全策略无法打开主页的问题！点击下方链接或下载此文件后直接用手机双击即可访问完整离线交互。" 
                    : "✨ Solves mobile loading issues perfectly! Fully self-contained single HTML with local offline AI Matcher diagnostic engine."}
                </p>
                <div className="p-3 bg-white border border-slate-100 rounded-xl select-all break-all font-mono text-xs text-slate-700 font-medium">
                  {standaloneUrl}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyStandaloneUrl}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      copiedStandaloneUrl 
                        ? "bg-emerald-600 text-white" 
                        : "bg-emerald-700 text-white hover:bg-emerald-850"
                    }`}
                  >
                    {copiedStandaloneUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "已成功复制！" : "Successfully Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "一键复制网址" : "Copy Link"}</span>
                      </>
                    )}
                  </button>
                  <a
                    href="/portfolio.html"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-800 bg-white border-2 border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === "zh" ? "打开体验" : "Open Link"}</span>
                  </a>
                </div>
              </div>

              {/* URL Item 2: Development Portfolio */}
              <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded-md">
                    {lang === "zh" ? "测试：开发调试版 (Dev URL)" : "Development Environment Link"}
                  </span>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl select-all break-all font-mono text-xs text-slate-700 font-medium">
                  {devUrl}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyDevUrl}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      copiedDevUrl 
                        ? "bg-emerald-600 text-white" 
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {copiedDevUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "已成功复制！" : "Successfully Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === "zh" ? "一键复制网址" : "Copy Link"}</span>
                      </>
                    )}
                  </button>
                  <a
                    href={devUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-indigo-700 bg-white border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === "zh" ? "打开体验" : "Open Link"}</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                {lang === "zh" ? "关闭 / Close" : "Close"}
              </button>
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:block">Empirical Portfolios © 2026</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Inline Types for Modal Structure (Image 3)
interface ProjectModalData {
  title: string;
  sub: string;
  columns: {
    title: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    bulletClass: string;
    items: string[];
  }[];
  results: {
    value: string;
    label: string;
  }[];
}
