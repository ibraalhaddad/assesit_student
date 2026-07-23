import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { db } from "./database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

// ==========================================
// 1. مسارات الفحص والتشغيل
// ==========================================
app.get("/", (req, res) => {
    res.send("AI Server Running with Groq 🚀");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({ success: true, serverTime: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 2. إدارة الدروس (Lessons Endpoints)
// ==========================================

// إدخال درس جديد متوافق مع جدول lessons (subject_id, title, html_content, mathml_content)
app.post("/lessons", async (req, res) => {
    try {
        const { title, html_content, mathml_content, subject_id } = req.body;

        // طباعة للتأكد من البيانات الوصلة في تيرمنال السيرفر
        console.log("البيانات المستلمة في السيرفر:", req.body);

        // التحقق من وجود الحقول الأساسية
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
        console.error("خطأ قاعدة البيانات:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

// جلب جميع الدروس
app.get("/lessons", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM lessons ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 3. الذكاء الاصطناعي والمحفوظات (AI Endpoints)
// ==========================================

// طلب معالجة من Groq وحفظ الرد في الأعمدة المخصصة بجدول ai_generations
app.post("/generate", async (req, res) => {
    try {
        const { lessonId, lesson, type = "summary" } = req.body; // type: summary, explanation, quiz, flashcards

        const prompt = `
        أنت مساعد تعليمي ذكي.
        نص الدرس: ${lesson}
        المطلوب هو إنشاء: ${type}
        
        أخرج النتيجة بصيغة JSON فقط، بحيث يحتوي الـ JSON على المفاتيح التالية حسب الحاجة:
        - "summary": نص التلخيص
        - "explanation": نص الشرح
        - "quiz": كائن أو مصفوفة لاختبار Quiz
        - "flashcards": كائن أو مصفوفة لبطاقات Flashcards
        `;

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Return only valid JSON. No markdown. No ```" },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const parsedResponse = JSON.parse(completion.choices[0].message.content);

        // حفظ النتائج في الأعمدة الصحيحة لجدول ai_generations
        const dbResult = await db.query(
            `INSERT INTO ai_generations 
            (lesson_id, provider, model, summary, explanation, quiz, flashcards) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                lessonId || null,
                "Groq",
                "llama-3.3-70b-versatile",
                type === 'summary' ? (parsedResponse.summary || JSON.stringify(parsedResponse)) : null,
                type === 'explanation' ? (parsedResponse.explanation || JSON.stringify(parsedResponse)) : null,
                type === 'quiz' ? JSON.stringify(parsedResponse.quiz || parsedResponse) : null,
                type === 'flashcards' ? JSON.stringify(parsedResponse.flashcards || parsedResponse) : null
            ]
        );

        res.json({ success: true, data: dbResult.rows[0] });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// جلب جميع استجابات الـ AI المحفوظة مع ربطها بعنوان الدرس إن أمكن
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
    console.log(`AI Server running on port ${PORT} with Groq 🚀`);
});