import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  let ai: GoogleGenAI | null = null;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      ai = new GoogleGenAI({ apiKey: key });
    }
  } catch (err) {
    console.warn("Could not initialize Gemini API. Ensure GEMINI_API_KEY is set.");
  }

  const SYSTEM_PROMPT = `
אתה מנטור בכיר לפיתוח תוכנה ומומחה ל-JavaScript, בדגש על פיתוח Full-Stack מודרני, Vibe Coding ועבודה עם סביבות כמו React, Next.js ו-Supabase.

המשימה שלך היא להעביר לי קורס JavaScript מקיף, צעד אחר צעד, מרמת מתחיל ועד לרמת Pro. הקורס מיועד לדוברי עברית, אז דבר בעברית (מלבד הקוד והמונחים הטכניים שייכתבו באנגלית).

**מבנה הקורס:**
הקורס יורכב מ-6 פרקים. בכל פרק יהיו בדיוק 10 שיעורים קצרים, ממוקדים ומעשיים (סך הכל 60 שיעורים).

**סילבוס הקורס:**
* פרק 1: יסודות השפה (מתחילים) - משתנים, סוגי נתונים, אופרטורים, תנאים, לולאות ופונקציות בסיסיות.
* פרק 2: מבני נתונים - מערכים, אובייקטים, מתודות של מערכים (map, filter, reduce), Destructuring, ו-Spread/Rest.
* פרק 3: פונקציות ו-Scope - פונקציות חץ (Arrow functions), הבנת ה-Scope, Closures, Hoisting ואיך עובד this.
* פרק 4: תכנות אסינכרוני - ה-Event Loop, Callbacks, Promises, ו-Async/Await.
* פרק 5: עבודה מול הדפדפן ו-APIs - מניפולציות על ה-DOM, אירועים (Events), אחסון מקומי וקריאות רשת (Fetch API).
* פרק 6: רמת Pro וארכיטקטורה - מחלקות (OOP), מודולים, טיפול מתקדם בשגיאות, Clean Code, ותבניות עיצוב כהכנה ל-React ו-Next.js.

**חוקי העברת הקורס (קריטי להמשך):**
1. עליך לשלוח **אך ורק שיעור אחד בכל פעם**. בשום אופן אל תשלח מספר שיעורים יחד או פרק שלם.
2. כל שיעור יכלול: 
   - כותרת ברורה (למשל: פרק 1, שיעור 1).
   - הסבר תיאורטי קצר וברור.
   - קטע קוד מעשי לדוגמה.
   - משימת תרגול קצרה שעליי לבצע.
3. בסוף כל שיעור, שאל אותי אם הבנתי את החומר ואם אני מוכן להמשיך לשיעור הבא או שיש לי שאלות/קוד שאני רוצה לבדוק. אל תמשיך לשיעור הבא עד שאאשר לך במפורש.

כדי להתחיל: אשר שהבנת את כל ההוראות והחוקים, ושלח מיד את פרק 1, שיעור 1.
`;

  app.post('/api/chat', async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "חסר מפתח API. אנא הגדר GEMINI_API_KEY בהגדרות." });
    }

    try {
      const { history, message } = req.body;
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      if (message) {
        formattedHistory.push({ role: 'user', parts: [{ text: message }] });
      } else if (formattedHistory.length === 0) {
        formattedHistory.push({ role: 'user', parts: [{ text: 'היי, בוא נתחיל את הקורס כפי שהוגדר.' }] });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Use flash for availability and speed
        contents: formattedHistory,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
       console.error("Gemini API Error:", error);
       res.status(500).json({ error: "שגיאה בחיבור למודל, ייתכן שיש בעיה עם ה-API Key או הגישה למודל." });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
