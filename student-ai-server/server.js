import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { db } from "./database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// إعداد مزودات الذكاء الاصطناعي
// ==========================================
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

const cerebras = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1" 
});

const gemini = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// خريطة النماذج الافتراضية
const MODEL_MAP = {
    summary: { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" },
    quiz: { provider: openrouter, model: "deepseek/deepseek-r1", name: "OpenRouter" },
    flashcards: { provider: groq, model: "qwen/qwen3-32b", name: "Groq" },
    math: { provider: gemini, model: "gemini-1.5-flash", name: "Gemini" },
    explanation: { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" }
};

const AVAILABLE_PROVIDERS = [
    { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" },
    { provider: gemini, model: "gemini-1.5-flash", name: "Gemini" },
    { provider: openrouter, model: "deepseek/deepseek-r1", name: "OpenRouter" },
    { provider: cerebras, model: "llama3.1-8b", name: "Cerebras" }
];

// ==========================================
// دوال مساعدة
// ==========================================

function cleanJSONResponse(content) {
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    cleaned = cleaned.replace(/(?<!\\)\\frac/g, "\\\\frac");
    cleaned = cleaned.replace(/\\([^"\\/bfnrt])/g, "\\\\$1");
    cleaned = cleaned.replace(/\\\\\\([a-zA-Z])/g, '\\\\\\\\$1');

    return cleaned;
}

// تعديل الدالة لتقبل الموديل المخصص (requestedModel)
async function generateAI({ prompt, type, requestedProvider, requestedModel }) {
    let primaryConfig = { 
        provider: MODEL_MAP[type]?.provider || groq, 
        model: MODEL_MAP[type]?.model || "llama-3.3-70b-versatile", 
        name: MODEL_MAP[type]?.name || "Groq" 
    };

    const providerInstances = {
        groq: { instance: groq, name: "Groq" },
        gemini: { instance: gemini, name: "Gemini" },
        openrouter: { instance: openrouter, name: "OpenRouter" },
        cerebras: { instance: cerebras, name: "Cerebras" }
    };

    if (requestedProvider) {
        const provKey = requestedProvider.toLowerCase();
        if (providerInstances[provKey]) {
            primaryConfig.provider = providerInstances[provKey].instance;
            primaryConfig.name = providerInstances[provKey].name;
        }
    }

    if (requestedModel) {
        primaryConfig.model = requestedModel;
    }

    const attemptConfigs = [
        primaryConfig,
        ...AVAILABLE_PROVIDERS.filter(p => p.name !== primaryConfig.name || p.model !== primaryConfig.model)
    ];

    for (const config of attemptConfigs) {
        try {
            console.log(`⏳ Trying provider: ${config.name} with model: ${config.model}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => { controller.abort(); }, 60000);

            const response = await config.provider.chat.completions.create({
                model: config.model,
                messages: [
                    { role: "system", content: "You are an AI that outputs ONLY strict valid JSON. No markdown, no conversational text." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            }, { signal: controller.signal });

            clearTimeout(timeoutId);

            return {
                content: response.choices[0].message.content,
                providerName: config.name,
                modelName: config.model
            };
        } catch (error) {
            console.error(`❌ Provider ${config.name} (${config.model}) Failed:`, error.message);
        }
    }

    throw new Error("All AI Providers Failed (الذكاء الاصطناعي غير متاح حالياً)");
}

// ==========================================
// مسارات (Routes)
// ==========================================
app.get("/", (req, res) => {
    res.send("AI Server Running with Multiple Providers 🚀");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({ success: true, serverTime: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔥 مسار جديد: جلب النماذج المتاحة من المزودين
app.get("/ai-models", async (req, res) => {
    try {
        const modelsData = {};

        try {
            const groqModels = await groq.models.list();
            modelsData.Groq = groqModels.data.map(m => m.id);
        } catch (e) {
            modelsData.Groq = ["llama-3.3-70b-versatile", "gemma2-9b-it", "mixtral-8x7b-32768"];
        }

        try {
            const openrouterModels = await openrouter.models.list();
            modelsData.OpenRouter = openrouterModels.data.map(m => m.id);
        } catch (e) {
            modelsData.OpenRouter = ["deepseek/deepseek-r1", "openai/gpt-4o", "anthropic/claude-3.5-sonnet"];
        }

        try {
            const cerebrasModels = await cerebras.models.list();
            modelsData.Cerebras = cerebrasModels.data.map(m => m.id);
        } catch (e) {
            modelsData.Cerebras = ["llama3.1-8b"];
        }

        modelsData.Gemini = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];

        res.json({ success: true, models: modelsData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/lessons", async (req, res) => {
    try {
        const { title, html_content, mathml_content, subject_id } = req.body;

        if (!title || !html_content) {
            return res.status(400).json({ success: false, error: "العنوان والمحتوى مطلوبان" });
        }

        const query = `
            INSERT INTO lessons (title, html_content, mathml_content, subject_id) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [title, html_content, mathml_content || '', subject_id || 1];

        const result = await db.query(query, values);
        res.status(201).json({ success: true, data: result.rows[0] });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get("/lessons", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM lessons ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/generate", async (req, res) => {
    try {
        // 🔥 استقبال aiModel من الطلب
        const { lessonId, lesson, type = "summary", aiProvider, aiModel } = req.body;

        const prompt = `
        أنت مساعد تعليمي ذكي.
        نص الدرس: ${lesson}
        
        المطلوب: إنشاء ${type} استناداً إلى نص الدرس فقط.
        
        تعليمات صارمة جداً (CRITICAL INSTRUCTIONS):
        1. أخرج النتيجة بصيغة JSON صحيح فقط (Valid JSON Object). لا تستخدم Markdown format.
        2. لا تضف أي نص أو شرح قبل أو بعد الـ JSON.
        3. هام جداً للمعادلات الرياضية (LaTeX): يمنع استخدام شرطة مائلة واحدة (\\). يجب مضاعفة الـ Backslash! اكتب \\\\sqrt بدلاً من \\sqrt، واكتب \\\\frac بدلاً من \\frac لكي لا يتعطل الـ JSON.
        4. التزم بهذا الهيكل تماماً:
        - إذا كان المطلوب summary: { "summary": "النص هنا" }
        - إذا كان المطلوب explanation: { "explanation": "النص هنا" }
        - إذا كان المطلوب flashcards: { "flashcards": [ { "term": "المصطلح", "definition": "التعريف" } ] }
        - إذا كان المطلوب quiz: 
        {
          "quiz": [
            {
              "question": "نص السؤال؟",
              "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
              "correctAnswer": "خيار 1"
            }
          ]
        }
        `;

        // تمرير aiProvider و aiModel للدالة
        const aiResult = await generateAI({ prompt, type, requestedProvider: aiProvider, requestedModel: aiModel });

        const cleanContent = cleanJSONResponse(aiResult.content);

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse JSON response. Raw string was:\n", cleanContent);
            return res.status(500).json({ success: false, error: "الذكاء الاصطناعي أرجع بيانات غير مهيكلة بشكل صحيح. يرجى المحاولة مرة أخرى." });
        }

        const dbResult = await db.query(
            `INSERT INTO ai_generations 
            (lesson_id, provider, model, summary, explanation, quiz, flashcards) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                lessonId || null,
                aiResult.providerName,
                aiResult.modelName,
                type === 'summary' ? (parsedResponse.summary || JSON.stringify(parsedResponse)) : null,
                type === 'explanation' ? (parsedResponse.explanation || JSON.stringify(parsedResponse)) : null,
                type === 'quiz' ? JSON.stringify(parsedResponse.quiz || parsedResponse) : null,
                type === 'flashcards' ? JSON.stringify(parsedResponse.flashcards || parsedResponse) : null
            ]
        );

        res.json({ success: true, data: dbResult.rows[0] });

    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/ai-responses", async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.lesson_id, a.provider, a.model, 
                   a.summary, a.explanation, a.quiz, a.flashcards, 
                   a.generated_at,
                   COALESCE(l.title, 'درس عام') as "lessonTitle"
            FROM ai_generations a
            LEFT JOIN lessons l ON a.lesson_id = l.id
            ORDER BY a.id DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// تشغيل الخادم
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Server running on port ${PORT} 🚀`);
});