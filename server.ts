import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } else {
    console.log("No valid GEMINI_API_KEY found. Running in fallback mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

// System instructions for Pan Biying background matching
const SYSTEM_INSTRUCTION = `
You are an expert HR and Product Recruiter matching system. Your job is to analyze a given Job Description (JD) and evaluate how well it matches Pan Biying (潘碧莹)'s background.
You must return the analysis strictly as a JSON object matching the requested schema.

Pan Biying (潘碧莹) Resume Context:
- Name: 潘碧莹 (Pan Biying), Graduate student at Guangdong University of Technology (广东工业大学) in Industrial Design Engineering (工业设计工程) (2025 - 2028).
- Major Focus: Service Experience Design (服务体验设计), User Research (用户研究).
- Role Fit: Product Manager (产品经理), User Researcher (用户研究员), Service Experience Designer (服务体验设计师).
- Key Strengths:
  1. Solid service experience design & design research methodology background.
  2. Rich user research and field research experiences (fieldwork, personas, user behavioral analysis, usability evaluation).
  3. AI-augmented workflow explorer (using ChatGPT for analysis, Midjourney for concept visualization, and OpenCode/JS/Vite for web prototype development).
- Projects:
  1. Xiaomi TV Desktop System Design White Paper (小米电视桌面系统设计白皮书): Analyzed smart TV large-screen desktop user behaviors, browsing pathways, and interaction principles. Responsible for "User Behavior Analysis and Interaction Framework" chapters, designing layout logics based on behavioral data.
  2. Shanju Public Welfare Design Project (广东省工业设计协会“缮居”公益设计项目): Conducted field visits and deep interviews with assisted elderly/needy families in Shunde. Created user personas, analyzed spatial problem dynamics, mapped aging-friendly space optimizations, and authored systematic evaluation reports and design layout proposals.
- Skills:
  - User Research: Interviews, Fieldwork, User Persona, Behavioral Analysis, Needs Insight, Competitive Analysis, Report writing.
  - Product & Service Design: Service Experience Design, Product System Design, Interaction Framework, Information Architecture, Design Strategy, Presentation.
  - Software & Dev: Figma, Rhino, KeyShot, Blender, Photoshop, Illustrator, PPT, Notion.
  - AI Tools & Code: ChatGPT, Midjourney, OpenCode, JavaScript, AI prototyping.
- Honors: Huacan Award - National First Prize (华灿奖全国一等奖).

Evaluate the matching score (0-100) based on relevance to: Product Management, User Research, Service Design, UX/UI Interaction Design.
Provide constructive, realistic feedback. Include both Chinese (Zh) and English (En) text for highlights, improvements, summary, and role suggestions.
`;

app.post("/api/match-job", async (req, res) => {
  const { jd } = req.body;

  if (!jd || jd.trim() === "") {
    return res.status(400).json({ error: "Job description is empty" });
  }

  // If Gemini is initialized, use it!
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this Job Description (JD) and match against Pan Biying's resume profile:\n\n${jd}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Overall matching percentage score between 0 and 100" },
              matchLevel: { type: Type.STRING, description: "High, Medium, or Low" },
              skillsScore: {
                type: Type.OBJECT,
                properties: {
                  userResearch: { type: Type.INTEGER, description: "User Research capability score (0-100)" },
                  productUnderstanding: { type: Type.INTEGER, description: "Product Understanding capability score (0-100)" },
                  interactionFramework: { type: Type.INTEGER, description: "Interaction Framework capability score (0-100)" },
                  designExpression: { type: Type.INTEGER, description: "Design Expression capability score (0-100)" },
                  aiTools: { type: Type.INTEGER, description: "AI & Collaboration Tools capability score (0-100)" }
                },
                required: ["userResearch", "productUnderstanding", "interactionFramework", "designExpression", "aiTools"]
              },
              highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 bullet points in Chinese detailing why her background matches this JD"
              },
              improvements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 action points in Chinese on how she can improve or prepare for this role"
              },
              summary: { type: Type.STRING, description: "1-2 sentence Chinese summary of matching result" },
              roleSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Suggested matching job titles in Chinese"
              },
              highlightsEn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Highlights in English"
              },
              improvementsEn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Improvements in English"
              },
              summaryEn: { type: Type.STRING, description: "Summary in English" },
              roleSuggestionsEn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Suggested job titles in English"
              }
            },
            required: [
              "score", "matchLevel", "skillsScore", "highlights", "improvements", 
              "summary", "roleSuggestions", "highlightsEn", "improvementsEn", "summaryEn", "roleSuggestionsEn"
            ]
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsedData = JSON.parse(text);
        return res.json(parsedData);
      }
    } catch (err) {
      console.error("Gemini API call failed, using rule-based fallback:", err);
    }
  }

  // Fallback Rule-Based matching engine (Runs if Gemini fails or is not configured)
  const textJd = jd.toLowerCase();
  
  // Scoring weights
  let userResearchWeight = 75;
  let productWeight = 75;
  let interactionWeight = 75;
  let designWeight = 75;
  let aiWeight = 75;

  // Simple heuristic checks
  if (textJd.includes("用户研究") || textJd.includes("用研") || textJd.includes("user research") || textJd.includes("调研") || textJd.includes("访谈")) {
    userResearchWeight += 20;
    productWeight += 5;
  }
  if (textJd.includes("产品经理") || textJd.includes("product manager") || textJd.includes("需求") || textJd.includes("规划") || textJd.includes("prd")) {
    productWeight += 15;
    interactionWeight += 10;
  }
  if (textJd.includes("交互") || textJd.includes("体验") || textJd.includes("interaction") || textJd.includes("ux") || textJd.includes("figma") || textJd.includes("原型")) {
    interactionWeight += 20;
    designWeight += 10;
  }
  if (textJd.includes("工业设计") || textJd.includes("视觉") || textJd.includes("排版") || textJd.includes("ppt") || textJd.includes("报告") || textJd.includes("汇报")) {
    designWeight += 20;
  }
  if (textJd.includes("ai") || textJd.includes("chatgpt") || textJd.includes("midjourney") || textJd.includes("提示词") || textJd.includes("大模型") || textJd.includes("技术")) {
    aiWeight += 20;
  }

  // Normalize scores to max 98, min 50
  const clamp = (val: number) => Math.min(98, Math.max(50, val));
  const finalSkills = {
    userResearch: clamp(userResearchWeight),
    productUnderstanding: clamp(productWeight),
    interactionFramework: clamp(interactionWeight),
    designExpression: clamp(designWeight),
    aiTools: clamp(aiWeight)
  };

  const score = Math.round((finalSkills.userResearch + finalSkills.productUnderstanding + finalSkills.interactionFramework + finalSkills.designExpression + finalSkills.aiTools) / 5);
  let matchLevel = "Medium";
  if (score >= 85) matchLevel = "High";
  else if (score < 70) matchLevel = "Low";

  // Formulate highlights and improvements based on JD contents
  const highlights: string[] = [
    "具备服务体验设计与工业设计工程背景，能够从用户需求、产品系统与场景问题之间建立分析框架。",
    "有高价值的用户研究项目实战经验，负责撰写过小米电视系统白皮书，以及完成过缮居公益适老化空间实地调研。"
  ];
  const highlightsEn: string[] = [
    "Possesses an academic background in Service Experience Design and Industrial Design Engineering, enabling structural analysis of user scenarios.",
    "Proven experience in user research, including contributing to the Xiaomi TV Desktop White Paper and leading aging-friendly home surveys."
  ];

  if (finalSkills.userResearch > 85) {
    highlights.push("深度掌握用户画像、用户访谈、行为数据分析等用研工具，善于梳理评估报告。");
    highlightsEn.push("Demonstrates solid proficiency in user personas, in-depth interviews, behavioral analysis, and evaluation reports.");
  } else {
    highlights.push("熟练应用 Figma、Notion 以及现代 AI 工具（ChatGPT/Midjourney）加速研究交付与原型验证。");
    highlightsEn.push("Skilled in Figma, Notion, and leveraging AI tools (ChatGPT/Midjourney) to accelerate user research and prototyping.");
  }

  const improvements: string[] = [
    "建议结合本岗位职责，进一步提炼或编写针对性的产品需求文档（PRD）和交互线框图案例。",
    "在面试中可以着重强调用户研究成果如何实际转化为设计决策或业务增长点的闭环案例。"
  ];
  const improvementsEn: string[] = [
    "Recommend adding product requirements documents (PRD) or functional wireframes matching this role's focus.",
    "Emphasize the closed-loop impact of how your research findings directly drive design execution or product decisions."
  ];

  let summary = `潘碧莹与该岗位的匹配度为 ${score}%。她的服务体验设计背景、实战用研经验和AI协同设计能力是极佳的契合点。`;
  let summaryEn = `Pan Biying has a ${score}% match rate. Her expertise in service experience design, user research, and AI-assisted workflows align well with this position.`;

  let roleSuggestions = ["用户研究助理 / Intern", "产品助理 (APM)", "体验设计研究员 (UXR)"];
  let roleSuggestionsEn = ["Assistant User Researcher", "Associate Product Manager", "UX Experience Researcher"];

  return res.json({
    score,
    matchLevel,
    skillsScore: finalSkills,
    highlights,
    improvements,
    summary,
    roleSuggestions,
    highlightsEn,
    improvementsEn,
    summaryEn,
    roleSuggestionsEn
  });
});

async function start() {
  // Standalone single-file HTML route for easy mobile/offline sharing
  app.get("/portfolio.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "portfolio.html"));
  });
  app.get("/standalone", (req, res) => {
    res.sendFile(path.join(process.cwd(), "portfolio.html"));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

start().catch(err => {
  console.error("Failed to start full-stack server:", err);
});
