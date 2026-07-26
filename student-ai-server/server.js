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

// ==========================================
// النماذج الافتراضية لكل نوع ولكل مزود
// ==========================================
// تم تغيير OpenRouter الافتراضي لنموذج مجاني وممتاز لتفادي مشكلة الرصيد
const MODEL_MAP = {
    summary: { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" },
    quiz: { provider: openrouter, model: "meta-llama/llama-3.3-70b-instruct:free", name: "OpenRouter" },
    flashcards: { provider: groq, model: "qwen/qwen3-32b", name: "Groq" },
    math: { provider: gemini, model: "gemini-1.5-flash", name: "Gemini" },
    explanation: { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" },
    chat: { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" }
};

// النماذج الآمنة للاستخدام كبدائل في حال فشل المزود الأساسي (لكل مزود الموديل الصحيح الخاص به)
const AVAILABLE_PROVIDERS = [
    { provider: groq, model: "llama-3.3-70b-versatile", name: "Groq" },
    { provider: openrouter, model: "meta-llama/llama-3.3-70b-instruct:free", name: "OpenRouter" },
    { provider: gemini, model: "gemini-1.5-flash", name: "Gemini" },
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

    // 🔥 الحماية القصوى لمعادلات الرياضيات (LaTeX) داخل الـ JSON
    // 1. نقوم بمضاعفة جميع الشرطات المائلة \ لتصبح \\
    cleaned = cleaned.replace(/\\/g, "\\\\");
    // 2. نعيد إصلاح علامات التنصيص الأساسية للـ JSON لكي لا تتكسر
    cleaned = cleaned.replace(/\\\\"/g, '\\"');
    // 3. نعيد إصلاح رموز الأسطر والمسافات الافتراضية
    cleaned = cleaned.replace(/\\\\n/g, '\\n');
    cleaned = cleaned.replace(/\\\\t/g, '\\t');
    cleaned = cleaned.replace(/\\\\r/g, '\\r');

    return cleaned;
}

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

    // التحقق من المزود المطلوب من التطبيق
    if (requestedProvider) {
        const provKey = requestedProvider.toLowerCase();
        if (providerInstances[provKey]) {
            primaryConfig.provider = providerInstances[provKey].instance;
            primaryConfig.name = providerInstances[provKey].name;

            // إذا طلب التطبيق مزود معين ولكنه لم يحدد الموديل الصحيح، نضع الموديل الافتراضي للمزود لتفادي خطأ 400
            const safeModelMatch = AVAILABLE_PROVIDERS.find(p => p.name === primaryConfig.name);
            primaryConfig.model = safeModelMatch ? safeModelMatch.model : primaryConfig.model;
        }
    }

    // تحديث الموديل إذا طُلب صراحةً وكان يتناسب مع المزود
    if (requestedModel) {
        primaryConfig.model = requestedModel;
    }

    const attemptConfigs = [
        primaryConfig,
        ...AVAILABLE_PROVIDERS.filter(p => p.name !== primaryConfig.name)
    ];

    const isChat = type === 'chat';
    const systemPrompt = isChat
        ? "أنت مساعد تعليمي ذكي وودود. أجب على أسئلة الطالب بناءً على الدرس المقدم بوضوح. أجب باللغة العربية دائماً وبنسق منسق (Markdown)."
        : "You are an AI that outputs ONLY strict valid JSON. No markdown, no conversational text.";

    const temperature = isChat ? 0.7 : 0.2; // تقليل الحرارة في الـ JSON لضمان الهيكل

    for (const config of attemptConfigs) {
        try {
            console.log(`⏳ Trying provider: ${config.name} with model: ${config.model} for type: ${type}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => { controller.abort(); }, 60000);

            const response = await config.provider.chat.completions.create({
                model: config.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: temperature
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
            // إضافة النماذج المجانية والمضمونة يدوياً للسرعة
            modelsData.OpenRouter = ["meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-lite-preview-02-05:free", "deepseek/deepseek-chat"];
        } catch (e) {
            modelsData.OpenRouter = ["meta-llama/llama-3.3-70b-instruct:free"];
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
        const { lessonId, lesson, type = "summary", aiProvider, aiModel } = req.body;

        if (type === 'chat') {
            const aiResult = await generateAI({
                prompt: lesson,
                type: 'chat',
                requestedProvider: aiProvider,
                requestedModel: aiModel
            });

            return res.json({
                success: true,
                data: { chat: aiResult.content }
            });
        }

        const prompt = `
        أنت مساعد تعليمي ذكي.
        نص الدرس: ${lesson}
        
        المطلوب: إنشاء ${type} استناداً إلى نص الدرس فقط.
        
        تعليمات صارمة جداً (CRITICAL INSTRUCTIONS):
        1. أخرج النتيجة بصيغة JSON صحيح فقط (Valid JSON Object). لا تستخدم Markdown format.
        2. لا تضف أي نص أو شرح قبل أو بعد الـ JSON.
        3. تأكد من استخدام المفاتيح المطلوبة تماماً كما هو موضح أدناه:
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

        const aiResult = await generateAI({ prompt, type, requestedProvider: aiProvider, requestedModel: aiModel });

        const cleanContent = cleanJSONResponse(aiResult.content);

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse JSON response. Raw string was:\n", cleanContent);
            return res.status(500).json({ success: false, error: "فشل في معالجة البيانات، يرجى المحاولة مرة أخرى." });
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